// PCL lib Functions for processing point clouds 

#include "processPointClouds.h"


//constructor:
template<typename PointT>
ProcessPointClouds<PointT>::ProcessPointClouds() {}


//de-constructor:
template<typename PointT>
ProcessPointClouds<PointT>::~ProcessPointClouds() {}


template<typename PointT>
void ProcessPointClouds<PointT>::numPoints(typename pcl::PointCloud<PointT>::Ptr cloud)
{
    std::cout << cloud->points.size() << std::endl;
}


template<typename PointT>
typename pcl::PointCloud<PointT>::Ptr ProcessPointClouds<PointT>::FilterCloud(typename pcl::PointCloud<PointT>::Ptr cloud, float filterRes, Eigen::Vector4f minPoint, Eigen::Vector4f maxPoint)
{

    // Time segmentation process
    auto startTime = std::chrono::steady_clock::now();

    // TODO:: Fill in the function to do voxel grid point reduction and region based filtering
    //1.Voxel Grid
    //体素网格过滤将创建一个立方体网格, 过滤点云的方法是每个体素立方体内只留下一个点, 因此立方体每一边的长度越大, 点云的分辨率就越低. 但是如果体素网格太大, 就会损失掉物体原本的特征. 
    //具体实现可以查看PCL-voxel grid filtering的文档 .

    // Create the filtering object: downsample the dataset using a leaf size of .2m
    pcl::VoxelGrid<PointT> vg;
    typename pcl::PointCloud<PointT>::Ptr cloudFiltered(new pcl::PointCloud<PointT>);
    vg.setInputCloud(cloud);
    vg.setLeafSize(filterRes, filterRes, filterRes);
    vg.filter(*cloudFiltered);

    // 2.Region of Interest
    // 定义感兴趣区域, 并删除感兴趣区域外的任何点：感兴趣区域的选择两侧需要尽量覆盖车道的宽度, 而前后的区域要保证你可以及时检测到前后车辆的移动. 
    // 具体实现可以查看PCL-region of interest的文档. 在最终结果中, 我们使用pcl CropBox 查找自身车辆车顶的点云数据索引, 
    // 然后将这些索引提供给 pcl ExtractIndices 对象删除, 因为这些对于我们分析点云数据没有用处.

    typename pcl::PointCloud<PointT>::Ptr cloudRegion(new pcl::PointCloud<PointT>);
    pcl::CropBox<PointT> region(true);
    region.setMin(minPoint);
    region.setMax(maxPoint);
    region.setInputCloud(cloudFiltered);
    region.filter(*cloudRegion);

    // 提取车身周围范围内的所有的点，并将提取到的所有点保存在indices中
    std::vector<int> indices;
    pcl::CropBox<PointT> roof(true);
    roof.setMin(Eigen::Vector4f(-1.5, -1.7, -1, 1));
    roof.setMax(Eigen::Vector4f(2.6, 1.7, -0.4, 1));
    roof.setInputCloud(cloudRegion);
    roof.filter(indices);

    pcl::PointIndices::Ptr inliers{new pcl::PointIndices}; // 创建一个内点对象，将提取到车身周围点，放到内点对象中
    for (int point : indices) {
        inliers->indices.push_back(point);
    }
    pcl::ExtractIndices<PointT> extract;
    extract.setInputCloud(cloudRegion);
    extract.setIndices(inliers);
    extract.setNegative(true); // false 提取内点也就是提取车身周围的几个点，， true 提取出了车身周围的点
    extract.filter(*cloudRegion);

    auto endTime = std::chrono::steady_clock::now();
    auto elapsedTime = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    std::cout << "filtering took " << elapsedTime.count() << " milliseconds" << std::endl;

    return cloudRegion;
    // return cloud;

}


template<typename PointT>
std::pair<typename pcl::PointCloud<PointT>::Ptr, typename pcl::PointCloud<PointT>::Ptr>
ProcessPointClouds<PointT>::RansacSegmentPlane(typename pcl::PointCloud<PointT>::Ptr cloud, int maxIterations, float distanceTol) {
    //PCL RANSAC Segmentaion
    //针对本项目, 我创建了两个函数SegmentPlane和SeparateClouds, 分别用来寻找点云中在道路平面的inliers(内联点)和提取点云中的outliers(物体).

    // Count time
    auto startTime = std::chrono::steady_clock::now();
    srand(time(NULL));

    int num_points = cloud->points.size();
    auto cloud_points = cloud->points;
    Ransac<PointT> RansacSeg(maxIterations, distanceTol, num_points);

    // Get inliers from RANSAC implementation
    std::unordered_set<int> inliersResult = RansacSeg.Ransac3d(cloud);

    auto endTime = std::chrono::steady_clock::now();
    auto elapsedTime = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    std::cout << "plane ransac-segment took " << elapsedTime.count() << " milliseconds" << std::endl;

    typename pcl::PointCloud<PointT>::Ptr out_plane(new pcl::PointCloud<PointT>());
    typename pcl::PointCloud<PointT>::Ptr in_plane(new pcl::PointCloud<PointT>());

    for (int i = 0; i < num_points; i++) {
        PointT pt = cloud_points[i];
        if (inliersResult.count(i)) {
            out_plane->points.push_back(pt);
        } else {
            in_plane->points.push_back(pt);
        }
    }
    return std::pair<typename pcl::PointCloud<PointT>::Ptr, typename pcl::PointCloud<PointT>::Ptr>(in_plane, out_plane);

}

template<typename PointT>
std::pair<typename pcl::PointCloud<PointT>::Ptr, typename pcl::PointCloud<PointT>::Ptr> ProcessPointClouds<PointT>::SegmentPlane(typename pcl::PointCloud<PointT>::Ptr cloud, int maxIterations, float distanceThreshold)
{   
    // PCL RANSAC Segmentaion
    // 针对本项目, 我创建了两个函数SegmentPlane和SeparateClouds, 分别用来寻找点云中在道路平面的inliers(内联点)和提取点云中的outliers(物体).
    
    // Time segmentation process
    auto startTime = std::chrono::steady_clock::now();
	// pcl::PointIndices::Ptr inliers;
    pcl::PointIndices::Ptr inliers(new pcl::PointIndices); // Build on the heap
    // TODO:: Fill in this function to find inliers for the cloud.

    pcl::ModelCoefficients::Ptr coefficient(new pcl::ModelCoefficients);
    pcl::SACSegmentation<PointT> seg;

    // 在SegmentPlane函数中我们接受点云、最大迭代次数和距离容忍度作为参数, 使用std::pair对象来储存物体和道路路面的点云. 
    // SeparateClouds 函数提取点云中的非inliers点, 即obstacles点. 粒子分割是一个迭代的过程, 更多的迭代有机会返回更好的结果, 但同时需要更长的时间. 
    // 过大的距离容忍度会导致不是一个物体的点云被当成同一个物体, 而过小的距离容忍度会导致一个较长的物体无法被当成同一个物体, 比如卡车.
    seg.setOptimizeCoefficients(true);
    seg.setModelType(pcl::SACMODEL_PLANE);
    seg.setMethodType(pcl::SAC_RANSAC);
    seg.setMaxIterations(maxIterations);
    seg.setDistanceThreshold(distanceThreshold);

    // Segment the largest planar component from the remaining cloud
    seg.setInputCloud(cloud);
    seg.segment(*inliers, *coefficient);

    if (inliers->indices.size() == 0) {
        std::cerr << "Could not estimate a planar model for the given dataset" << std::endl;
    }

    auto endTime = std::chrono::steady_clock::now();
    auto elapsedTime = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    std::cout << "plane segmentation took " << elapsedTime.count() << " milliseconds" << std::endl;

    std::pair<typename pcl::PointCloud<PointT>::Ptr, typename pcl::PointCloud<PointT>::Ptr> segResult = SeparateClouds(inliers,cloud);
    return segResult;
}


template<typename PointT>
std::pair<typename pcl::PointCloud<PointT>::Ptr, typename pcl::PointCloud<PointT>::Ptr> ProcessPointClouds<PointT>::SeparateClouds(pcl::PointIndices::Ptr inliers, typename pcl::PointCloud<PointT>::Ptr cloud) 
{
    // Segmentation的任务是将属于道路的点和属于场景的点分开. 点云分割的具体细节推荐查看PCL的官网文档: Segmentation和Extracting indices .
    // TODO: Create two new point clouds, one cloud with obstacles and other with segmented plane
    typename pcl::PointCloud<PointT>::Ptr obstCloud(new pcl::PointCloud<PointT>());
    typename pcl::PointCloud<PointT>::Ptr planeCloud(new pcl::PointCloud<PointT>());
    for (int index : inliers->indices) {
        planeCloud->points.push_back(cloud->points[index]);
    }
    // create extraction object
    pcl::ExtractIndices<PointT> extract;
    extract.setInputCloud(cloud);
    extract.setIndices(inliers);
    extract.setNegative(true);
    extract.filter(*obstCloud);
    std::pair<typename pcl::PointCloud<PointT>::Ptr, typename pcl::PointCloud<PointT>::Ptr> segResult(obstCloud, planeCloud);

    // std::pair<typename pcl::PointCloud<PointT>::Ptr, typename pcl::PointCloud<PointT>::Ptr> segResult(cloud, cloud);
    return segResult;
}



template<typename PointT>
std::vector<typename pcl::PointCloud<PointT>::Ptr> ProcessPointClouds<PointT>::Clustering(typename pcl::PointCloud<PointT>::Ptr cloud, float clusterTolerance, int minSize, int maxSize)
{

    // Time clustering process
    auto startTime = std::chrono::steady_clock::now();

    std::vector<typename pcl::PointCloud<PointT>::Ptr> clusters;

    // TODO:: Fill in the function to perform euclidean clustering to group detected obstacles
    // Build Kd-Tree Object
    typename pcl::search::KdTree<PointT>::Ptr tree(new pcl::search::KdTree<PointT>);
    // Input obstacle point cloud to create KD-tree
    tree->setInputCloud(cloud);

    std::vector<pcl::PointIndices> clusterIndices; // this is point cloud indice type
    pcl::EuclideanClusterExtraction<PointT> ec; // clustering object
    ec.setClusterTolerance(clusterTolerance); //设置聚类点与点之间的距离阈值。
    ec.setMinClusterSize(minSize); //设置聚类点最少数目，排除噪音点的影响。
    ec.setMaxClusterSize(maxSize); //设置聚类点最大数目。只有最小与最大数目之间的聚类才能够返回。
    ec.setSearchMethod(tree);  //通过kd-tree的方式搜索。
    ec.setInputCloud(cloud); // feed point cloud
    ec.extract(clusterIndices); // get all clusters Indice

    // For each cluster indice
    for (pcl::PointIndices getIndices: clusterIndices) {
        typename pcl::PointCloud<PointT>::Ptr cloudCluster(new pcl::PointCloud<PointT>);
        // For each point indice in each cluster
        for (int index:getIndices.indices) {
            cloudCluster->points.push_back(cloud->points[index]);
        }
        cloudCluster->width = cloudCluster->points.size();
        cloudCluster->height = 1;
        cloudCluster->is_dense = true;
        clusters.push_back(cloudCluster);

    }

    auto endTime = std::chrono::steady_clock::now();
    auto elapsedTime = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    std::cout << "clustering took " << elapsedTime.count() << " milliseconds and found " << clusters.size() << " clusters" << std::endl;

    return clusters;
}


template<typename PointT>
std::vector<typename pcl::PointCloud<PointT>::Ptr>
ProcessPointClouds<PointT>::EuclideanClustering(typename pcl::PointCloud<PointT>::Ptr cloud, float clusterTolerance, int minSize,
                                                int maxSize) {
    // 首先我们使用PCL内置的欧式聚类函数. 点云聚类的具体细节推荐查看PCL的官网文档Euclidean Cluster.
    // 欧氏聚类对象 ec 具有距离容忍度. 在这个距离之内的任何点都将被组合在一起. 
    // 它还有用于表示集群的点数的 min 和 max 参数. 如果一个集群真的很小, 它可能只是噪音, min参数会限制使用这个集群. 
    // 而max参数允许我们更好地分解非常大的集群, 如果一个集群非常大, 可能只是许多其他集群重叠, 最大容差可以帮助我们更好地解决对象检测. 
    // 欧式聚类的最后一个参数是 Kd-Tree. Kd-Tree是使用输入点云创建和构建的, 这些输入云点是初始点云过滤分割后得到障碍物点云.
    // 以下是PCL内置欧式聚类函数的代码:

    // Time clustering process
    auto startTime = std::chrono::steady_clock::now();

    // std::vector<typename pcl::PointCloud<PointT>::Ptr> clusters;

    ClusterPts<PointT> clusterPoints(cloud->points.size(), clusterTolerance, minSize, maxSize);

    std::vector<typename pcl::PointCloud<PointT>::Ptr> clusters = clusterPoints.EuclidCluster(cloud);


    auto endTime = std::chrono::steady_clock::now();
    auto elapsedTime = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
    std::cout << "KDTree clustering took " << elapsedTime.count() << " milliseconds and found " << clusters.size()
              << " clusters" << std::endl;

    return clusters;
}


template<typename PointT>
Box ProcessPointClouds<PointT>::BoundingBox(typename pcl::PointCloud<PointT>::Ptr cluster)
{

    // Find bounding box for one of the clusters
    PointT minPoint, maxPoint;
    pcl::getMinMax3D(*cluster, minPoint, maxPoint); //想得到它x,y,z三个轴上的最大值和最小值

    Box box;
    box.x_min = minPoint.x;
    box.y_min = minPoint.y;
    box.z_min = minPoint.z;
    box.x_max = maxPoint.x;
    box.y_max = maxPoint.y;
    box.z_max = maxPoint.z;

    return box;
}


template<typename PointT>
void ProcessPointClouds<PointT>::savePcd(typename pcl::PointCloud<PointT>::Ptr cloud, std::string file)
{
    pcl::io::savePCDFileASCII (file, *cloud);
    std::cerr << "Saved " << cloud->points.size () << " data points to "+file << std::endl;
}


template<typename PointT>
typename pcl::PointCloud<PointT>::Ptr ProcessPointClouds<PointT>::loadPcd(std::string file)
{

    typename pcl::PointCloud<PointT>::Ptr cloud (new pcl::PointCloud<PointT>);

    if (pcl::io::loadPCDFile<PointT> (file, *cloud) == -1) //* load the file
    {
        PCL_ERROR ("Couldn't read file \n");
    }
    std::cerr << "Loaded " << cloud->points.size () << " data points from "+file << std::endl;

    return cloud;
}


template<typename PointT>
std::vector<boost::filesystem::path> ProcessPointClouds<PointT>::streamPcd(std::string dataPath)
{

    std::vector<boost::filesystem::path> paths(boost::filesystem::directory_iterator{dataPath}, boost::filesystem::directory_iterator{});

    // sort files in accending order so playback is chronological
    sort(paths.begin(), paths.end());

    return paths;

}
