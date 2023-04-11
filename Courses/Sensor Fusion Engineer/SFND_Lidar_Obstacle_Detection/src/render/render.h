/* \author Aaron Brown */
// Functions and structs used to render the enviroment 用于环境渲染的函数和结构体
// such as cars and the highway


#ifndef RENDER_H
#define RENDER_H
//以上是为了避免头文件的重复使用

#include <pcl/visualization/pcl_visualizer.h>
#include "box.h"
#include <iostream>
#include <vector>
#include <string>

struct Color // 结构体中使用构造函数初始化列表
{ 

	float r, g, b;

	Color(float setR, float setG, float setB)  // 构造函数初始化列表
		: r(setR), g(setG), b(setB)
	{}

	// Color(float setR, float setG, float setB)    // 含有参数的构造函数，以便创建Color变量时不向其传递参数时，提供默认值
	// {
	// 	r = setR;
	// 	g = setG;
	// 	b = setB;
	// }

};

struct Vect3
{

	double x, y, z;

	Vect3(double setX, double setY, double setZ): x(setX), y(setY), z(setZ){} //构造函数初始化列表,给x,y,z赋值

	Vect3 operator+(const Vect3& vec)  // 函数重载,将结构体传递给函数
	{
		Vect3 result(x + vec.x, y + vec.y, z + vec.z);
		return result;
	}

};

enum CameraAngle //枚举类型
{ 
	XY, TopDown, Side, FPS
};

struct Car
{

	// 变量 position （位置）和 dimensions （尺寸大小）两个变量中的xyz的单位为米
	// units in meters
  	Vect3 position, dimensions;
  	
  	std::string name;
  	Color color;

	//构造函数初始化列表
  	Car(Vect3 setPosition, Vect3 setDimensions, Color setColor, std::string setName)
    	: position(setPosition), dimensions(setDimensions), color(setColor), name(setName)
  	{}

  	void render(pcl::visualization::PCLVisualizer::Ptr& viewer)
	{
		// render bottom of car  车辆底部的渲染
		// viewer->addCube 向视图中添加一个立方体模型

		/*
		bool pcl::visualization::PCLVisualizer::addCube  ( float  x_min,  
					float  x_max,  
					float  y_min,  
					float  y_max,  
					float  z_min,  
					float  z_max,  
					double  r = 1.0,  
					double  g = 1.0,  
					double  b = 1.0,  
					const std::string &  id = "cube",  
					int  viewport = 0  
					) 
		*/

		// render bottom of car car渲染汽车底部
		viewer->addCube(position.x-dimensions.x/2, position.x+dimensions.x/2, position.y-dimensions.y/2, position.y+dimensions.y/2, position.z, position.z+dimensions.z*2/3, color.r, color.g, color.b, name); 
		
		// setShapeRenderingProperties 设置格子的属性
		viewer->setShapeRenderingProperties(pcl::visualization::PCL_VISUALIZER_REPRESENTATION, pcl::visualization::PCL_VISUALIZER_REPRESENTATION_SURFACE, name); 
		viewer->setShapeRenderingProperties(pcl::visualization::PCL_VISUALIZER_COLOR, color.r, color.g, color.b, name);
		viewer->setShapeRenderingProperties(pcl::visualization::PCL_VISUALIZER_OPACITY, 1.0, name);
		
		// render top of car  车辆顶部的渲染
		viewer->addCube(position.x-dimensions.x/4, position.x+dimensions.x/4, position.y-dimensions.y/2, position.y+dimensions.y/2, position.z+dimensions.z*2/3, position.z+dimensions.z, color.r, color.g, color.b, name+"Top"); 
		viewer->setShapeRenderingProperties(pcl::visualization::PCL_VISUALIZER_REPRESENTATION, pcl::visualization::PCL_VISUALIZER_REPRESENTATION_SURFACE, name+"Top"); 
		viewer->setShapeRenderingProperties(pcl::visualization::PCL_VISUALIZER_COLOR, color.r, color.g, color.b, name+"Top");
		viewer->setShapeRenderingProperties(pcl::visualization::PCL_VISUALIZER_OPACITY, 1.0, name+"Top");
	}

	// collision helper function 检测是否车辆与周围点碰撞
	bool inbetween(double point, double center, double range)
	{
		return (center-range <= point) && (center+range >= point);
	}

	bool checkCollision(Vect3 point)
	{
		return (inbetween(point.x,position.x,dimensions.x/2)&&inbetween(point.y,position.y,dimensions.y/2)&&inbetween(point.z,position.z+dimensions.z/3,dimensions.z/3))||
			   (inbetween(point.x,position.x,dimensions.x/4)&&inbetween(point.y,position.y,dimensions.y/2)&&inbetween(point.z,position.z+dimensions.z*5/6,dimensions.z/6));

	}
};

void renderHighway(pcl::visualization::PCLVisualizer::Ptr& viewer);
void renderRays(pcl::visualization::PCLVisualizer::Ptr& viewer, const Vect3& origin, const pcl::PointCloud<pcl::PointXYZ>::Ptr& cloud);
void clearRays(pcl::visualization::PCLVisualizer::Ptr& viewer);
void renderPointCloud(pcl::visualization::PCLVisualizer::Ptr& viewer, const pcl::PointCloud<pcl::PointXYZ>::Ptr& cloud, std::string name, Color color = Color(1,1,1));
void renderPointCloud(pcl::visualization::PCLVisualizer::Ptr& viewer, const pcl::PointCloud<pcl::PointXYZI>::Ptr& cloud, std::string name, Color color = Color(-1,-1,-1));
void renderBox(pcl::visualization::PCLVisualizer::Ptr& viewer, Box box, int id, Color color = Color(1,0,0), float opacity=1);
void renderBox(pcl::visualization::PCLVisualizer::Ptr& viewer, BoxQ box, int id, Color color = Color(1,0,0), float opacity=1);

#endif
