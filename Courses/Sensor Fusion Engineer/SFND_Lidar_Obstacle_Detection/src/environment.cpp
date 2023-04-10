/* \author Aaron Brown */
// Create simple 3d highway enviroment using PCL
// for exploring self-driving car sensors

#include "sensors/lidar.h"
#include "render/render.h"
#include "processPointClouds.h"
// using templates for processPointClouds so also include .cpp to help linker
#include "processPointClouds.cpp"

std::vector<Car> initHighway(bool renderScene, pcl::visualization::PCLVisualizer::Ptr& viewer)
{

    Car egoCar( Vect3(0,0,0),  Vect3(4,2,2), Color(0,1,0), "egoCar");
    Car car0( Vect3(25,-4,0),   Vect3(4,3,2), Color(0,1,1), "car0");
    Car car1( Vect3(15,0,0),   Vect3(4,2,2), Color(0,0,1), "car1");
    Car car2( Vect3(8,-4,0),   Vect3(4,2,2), Color(1,0,1), "car2");	
    Car car3( Vect3(-12,4,0),  Vect3(4,2,2), Color(0,0,1), "car3");
    Car car4( Vect3(-15,-4,0), Vect3(4,2,2), Color(1,0,0), "car4");
  
    std::vector<Car> cars;
    cars.push_back(egoCar);
    cars.push_back(car0);
    cars.push_back(car1);
    cars.push_back(car2);
    cars.push_back(car3);
    cars.push_back(car4);

    // drawing the three lanes
    renderHighway(viewer);

    if(renderScene)
    {
        // drawing the cars on the lanes
        egoCar.render(viewer);
        car0.render(viewer);
        car1.render(viewer);
        car2.render(viewer);
        car3.render(viewer);
        car4.render(viewer);
    }

    return cars;
}


// Test load pcd
void cityBlock(pcl::visualization::PCLVisualizer::Ptr& viewer){
   ProcessPointClouds<pcl::PointXYZI>pointProcessor;
   pcl::PointCloud<pcl::PointXYZI>::Ptr inputCloud = pointProcessor.loadPcd("../src/sensors/data/pcd/data_1/0000000000.pcd");
   renderPointCloud(viewer,inputCloud,"cloud");
}

// Test read Lidar data
void cityBlock(pcl::visualization::PCLVisualizer::Ptr &viewer, ProcessPointClouds<pcl::PointXYZI> *pointProcessorI,
               const pcl::PointCloud<pcl::PointXYZI>::Ptr &inputCloud) {
    // ----------------------------------------------------
    // -----Open 3D viewer and display City Block     -----
    // ----------------------------------------------------

    // Setting hyper parameters

    // FilterCloud
    // 1、滤波  滤波后点云存入filteredCloud
    float filterRes = 0.3; // size of voxel grid
    Eigen::Vector4f minpoint(-20, -6.5, -2, 1);
    Eigen::Vector4f maxpoint(40, 6.5, 1, 1);
    
    // 2、将滤波后的点云分割成地面和障碍物 结果存入segmentCloud中
    // SegmentPlane
    int maxIterations = 40;
    float distanceThreshold = 0.3;



    // Clustering
    float clusterTolerance = 0.5;
    int minsize = 10;
    int maxsize = 140;

    // 1, Filter

    // 2, Segment

    // 3, Cluster
        // 聚类是指把不同物体的点云分别组合聚集起来, 从而能让你跟踪汽车, 行人等多个目标. 其中一种对点云数据进行分组和聚类的方法称为欧氏聚类.
        // 欧式聚类是指将距离紧密度高的点云聚合起来. 为了有效地进行最近邻搜索, 可以使用 KD-Tree 数据结构, 
        // 这种结构平均可以加快从 o (n)到 o (log (n))的查找时间. 这是因为Kd-Tree允许你更好地分割你的搜索空间. 
        // 通过将点分组到 KD-Tree 中的区域中, 您可以避免计算可能有数千个点的距离, 因为你知道它们不会被考虑在一个紧邻的区域中.

    // 4, Boundboxing
        // 在完成点云聚类之后, 我们最后一步需要为点云集添加边界框. 其他物体如车辆, 行人的边界框的体积空间内是禁止进入的, 以免产生碰撞.

    // 5, Render

    // First:Filter cloud to reduce amount of points
    pcl::PointCloud<pcl::PointXYZI>::Ptr filteredCloud = pointProcessorI->FilterCloud(inputCloud, filterRes, minpoint,
                                                                                      maxpoint);
    
    // 2.1 返回地面点云 和 障碍物点云 
	// segmentCloud.first, "obstCloud" 
	// segmentCloud.second, "planeCloud"
    // Second: Segment the filtered cloud into obstacles and road
    std::pair<pcl::PointCloud<pcl::PointXYZI>::Ptr, pcl::PointCloud<pcl::PointXYZI>::Ptr> segmentCloud = pointProcessorI->RansacSegmentPlane(
            filteredCloud, maxIterations, distanceThreshold);

    // 2.2 选取待渲染的点云的种类分别为 障碍物、地面、全部点云
    // renderPointCloud(viewer, segmentCloud.first, "obstCloud", Color(1, 0, 0));
    // renderPointCloud(viewer, segmentCloud.second, "planeCloud", Color(0, 1, 0));
    renderPointCloud(viewer,inputCloud,"inputCloud");

    
    // 3、对去除地面后的障碍物点云进行聚类  segmentCloud.first, "obstCloud" 
    // Third: Cluster different obstacle cloud
    // std::vector<PtCdtr<PointT>> cloudClusters 返回了11类 每类中又包含了属于该类的点云
    std::vector<pcl::PointCloud<pcl::PointXYZI>::Ptr> cloudClusters = pointProcessorI->EuclideanClustering(segmentCloud.first,
                                                                                                  clusterTolerance,
                                                                                                  minsize, maxsize);
    int clusterId = 0;
    std::vector<Color> colors = {Color(1, 0, 0), Color(0, 1, 0), Color(0, 0, 1)};

    for (pcl::PointCloud<pcl::PointXYZI>::Ptr cluster : cloudClusters) { // 遍历每一类中的点

        std::cout << "cluster size";
        pointProcessorI->numPoints(cluster);
        renderPointCloud(viewer, cluster, "obstCLoud" + std::to_string(clusterId),
                         colors[clusterId % colors.size()]);
        
        // Fourth: Find bounding boxes for each obstacle cluster
        // Calling Bouding box function and render box
        // 输出BoundingBox，在environment.cpp/ simpleHighway下做如下设置。
        Box box = pointProcessorI->BoundingBox(cluster); // 遍历每一类中的点
        renderBox(viewer, box, clusterId); // 根据最值画框
        ++clusterId;

    }

}


void simpleHighway(pcl::visualization::PCLVisualizer::Ptr& viewer)
{
    // ----------------------------------------------------
    // -----Open 3D viewer and display simple highway -----
    // ----------------------------------------------------
    
    // RENDER OPTIONS
    bool renderScene = false; //false means don't showing the cars
    std::vector<Car> cars = initHighway(renderScene, viewer);
    
    // TODO:: Create lidar sensor
    Lidar *lidar = new Lidar(cars, 0);
    pcl::PointCloud<pcl::PointXYZ>::Ptr inputCloud = lidar->scan();
    // renderRays(viewer,lidar->position,inputCloud);
    renderPointCloud(viewer, inputCloud, "inputCloud");

    // TODO:: Create point processor
    ProcessPointClouds<pcl::PointXYZ> pointProcessor;
    bool render_obst = true;
    bool render_plane = true;
    bool render_cluster = true;
    bool render_box = true;

    // segmentCloud
    std::pair<pcl::PointCloud<pcl::PointXYZ>::Ptr, pcl::PointCloud<pcl::PointXYZ>::Ptr> segmentCloud = pointProcessor.SegmentPlane(inputCloud, 100, 0.2);
    if (render_obst) {
        renderPointCloud(viewer, segmentCloud.first, "obstCloud", Color(1, 0, 0));
    }
    if (render_plane) {
        renderPointCloud(viewer, segmentCloud.second, "planeCloud", Color(0, 1, 0));
    }


    // cloudClusters
    std::vector<pcl::PointCloud<pcl::PointXYZ>::Ptr> cloudClusters = pointProcessor.Clustering(segmentCloud.first, 1.0, 3, 30);
    int clusterId = 0;
    std::vector<Color> colors = {Color(1, 0, 0), Color(0, 1, 0), Color(0, 0, 1)};
    for (pcl::PointCloud<pcl::PointXYZ>::Ptr cluster : cloudClusters) {
        if (render_cluster) {
            std::cout << "cluster size:  ";
            pointProcessor.numPoints(cluster);
            renderPointCloud(viewer, cluster, "obstCLoud" + std::to_string(clusterId),
                             colors[clusterId % colors.size()]);
            ++clusterId;
        }
        if (render_box) {
            Box box = pointProcessor.BoundingBox(cluster);
            renderBox(viewer, box, clusterId);
        }
        ++clusterId;
    }
    renderPointCloud(viewer, segmentCloud.second, "planeCloud");


}


//setAngle: SWITCH CAMERA ANGLE {XY, TopDown, Side, FPS}
void initCamera(CameraAngle setAngle, pcl::visualization::PCLVisualizer::Ptr& viewer)
{
    // 1 pcl viwer 
    viewer->setBackgroundColor (0, 0, 0);
    
    // set camera position and angle
    // 2 pcl viwer 
    viewer->initCameraParameters();
    // distance away in meters
    int distance = 16;
    
    switch(setAngle)
    {   
        // 3 pcl viwer 
        case XY : viewer->setCameraPosition(-distance, -distance, distance, 1, 1, 0); break;
        case TopDown : viewer->setCameraPosition(0, 0, distance, 1, 0, 1); break;
        case Side : viewer->setCameraPosition(0, -distance, 0, 0, 0, 1); break;
        case FPS : viewer->setCameraPosition(-10, 0, 0, 0, 0, 1);
    }

    if(setAngle!=FPS)
        // 4 viewer->addCoordinateSystem (1.0)
        viewer->addCoordinateSystem (1.0);
}

// char* argv[] means array of char pointers, whereas char** argv means pointer to a char pointer.
int main (int argc, char** argv)
{
    std::cout << "starting enviroment" << std::endl;

    // Open PCL Visualizer Viewer
    pcl::visualization::PCLVisualizer::Ptr viewer (new pcl::visualization::PCLVisualizer ("3D Viewer"));
    CameraAngle setAngle = XY; // 设置不同的观察视角
    initCamera(setAngle, viewer);

    // For simpleHighway function
    // simpleHighway(viewer);
    // cityBlock(viewer);
    // while (!viewer->wasStopped ())
    // {
    //     viewer->spinOnce ();
    // }

    // ! TODO
    // Build PointProcessor on the heap
    // ProcessPointClouds<pcl::PointXYZI> *pointProcessorI = new ProcessPointClouds<pcl::PointXYZI>();
    // Build PointProcessor on the stack
    // ProcessPointClouds<pcl::PointXYZI> pointProcessorI;


    //  Stream cityBlock function
    ProcessPointClouds<pcl::PointXYZI> *pointProcessorI = new ProcessPointClouds<pcl::PointXYZI>();
    std::vector<boost::filesystem::path> stream = pointProcessorI->streamPcd("../src/sensors/data/pcd/data_2");
    auto streamIterator = stream.begin(); //从文件中的第一个点云文件开始
    pcl::PointCloud<pcl::PointXYZI>::Ptr inputCloudI; //创建点云对象

    while (!viewer->wasStopped()) {
        // Clear viewer
        viewer->removeAllPointClouds();
        viewer->removeAllShapes();

        // inputCloudI 为每一帧点云数据
        // Load pcd and run obstacle detection process
        inputCloudI = pointProcessorI->loadPcd((*streamIterator).string()); // 对每一个点云进行处理
        cityBlock(viewer, pointProcessorI, inputCloudI); // 主要处理程序 参数为视窗、点云处理类、点云
        streamIterator++;
        if (streamIterator == stream.end()) {
            streamIterator = stream.begin();
        }
        viewer->spinOnce();
    }
}