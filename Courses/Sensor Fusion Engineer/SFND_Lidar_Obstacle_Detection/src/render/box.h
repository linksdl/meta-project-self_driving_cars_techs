#ifndef BOX_H
#define BOX_H
#include <Eigen/Geometry> 

struct BoxQ
{
	Eigen::Vector3f bboxTransform; // Vector3f 单精度的xyz坐标 与之对应的Vector3D双精度，更加精确，但运行速度也会慢
	// 浮点型的四元数  Quaternion (const Scalar &w, const Scalar &x, const Scalar &y, const Scalar &z)
	/*
	四元数都是由实部w 加上三个虚部 x、y、z 组成
	四元数一般可表示为a + bx+ cy + dz，其中a、b、c 、d是实数
	*/
	Eigen::Quaternionf bboxQuaternion;
	float cube_length;
    float cube_width;
    float cube_height;
};

struct Box
{
	float x_min;
	float y_min;
	float z_min;
	float x_max;
	float y_max;
	float z_max;
};
#endif