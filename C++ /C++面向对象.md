### 4, C++ 面向对象


本章将重点涉及以下高频知识点：

1. [面向对象及其三大特性](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vwksyg/)
2. [重载、重写、隐藏的区别](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vwgk1v/)
3. [多态及其实现方法](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vwz3sj/)
4. [虚函数和纯虚函数详解](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vw1w6s/)
5. [虚函数和纯虚函数的区别](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vwy2qd/)
6. [虚函数的实现机制](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vwcp3h/)
7. [构造函数、析构函数是否可以定义成虚函数](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vwfy77/)
8. [多重继承的常见问题及避免方法](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vd53v2/)
9. [深拷贝和浅拷贝的区别](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdnzjd/)
10. [单继承和多继承的虚函数表结构](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vwbet3/)
11. [如何禁止构造函数的使用](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vwjxum/)
12. [什么是类的默认构造函数](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vwjjl1/)
13. [如何减少构造函数开销](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdxkw6/)
14. [C++ 类对象的初始化顺序](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdr2rg/)
15. [成员初始化列表效率高的原因](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdme9j/)
16. [友元函数的作用及使用场景](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdajxr/)
17. [静态绑定和动态绑定的实现](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vd21fs/)
18. [编译时多态和运行时多态的区别](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdv6bh/)
19. [C++ 模板编程](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vw47gr/)
20. [如何避免拷贝](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdhs05/)
21. [为什么拷贝构造函数必须声明为引用](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdowme/)
22. [如何禁止一个类被实例化](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdppov/)
23. [实例化一个对象需要哪几个阶段](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdax5t/)
24. [不允许修改类的成员变量的函数实现方法](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdw8y3/)
25. [对象创建限制在堆或栈](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vwsuzt/)[空类字节数及对应生成的成员函数](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vd9u2c/)
26. [类的大小](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vde7ai/)
27. [如何让类不能被继承](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vddi1m/)

#### 01. 面向对象及其三大特性 5

面试高频指数：★★★★★

* 面向对象：对象是指具体的某一个事物，这些事物的抽象就是类，类中包含数据（成员变量）和动作（成员方法）。
* 面向对象的三大特性：
  * 封装：将具体的实现过程和数据封装成一个函数，只能通过接口进行访问，降低耦合性。
  * 继承：子类继承父类的特征和行为，子类有父类的非 `private` 方法或成员变量，子类可以对父类的方法进行重写，增强了类之间的耦合性，但是当父类中的成员变量、成员函数或者类本身被 `final` 关键字修饰时，修饰的类不能继承，修饰的成员不能重写或修改。
  * 多态：多态就是不同继承类的对象，对同一消息做出不同的响应，基类的指针指向或绑定到派生类的对象，使得基类指针呈现不同的表现方式。在 `C++` 中多态一般是使用虚函数来实现的，使用基类指针调用函数方法时，如果该指针指向的是一个基类的对象，则调用的是基类的虚函数；如果该指针指向的是一个派生类的对象，则调用的是派生类的虚函数。

参考资料：

* [C++多态的实现原理](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/65410057)
* [C++ What is OOP?](https://leetcode.cn/link/?target=https://www.w3schools.com/cpp/cpp_oop.asp)
* [Object Oriented Programming in C++](https://leetcode.cn/link/?target=https://www.***.org/object-oriented-programming-in-cpp/)


#### 02. 重载、重写、隐藏的区别 5

面试高频指数：★★★★★

1. 函数重载:
   重载是指同一可访问区内被声明几个具有不同参数列（参数的类型、个数、顺序）的同名函数，根据参数列表确定调用哪个函数，重载不关心函数返回类型。

```
class A
{
public:
    void fun(int tmp);
    void fun(float tmp);        // 重载 参数类型不同（相对于上一个函数）
    void fun(int tmp, float tmp1); // 重载 参数个数不同（相对于上一个函数）
    void fun(float tmp, int tmp1); // 重载 参数顺序不同（相对于上一个函数）
    int fun(int tmp);            // error: 'int A::fun(int)' cannot be overloaded 错误：注意重载不关心函数返回类型
};

```

2. 函数隐藏：
   函数隐藏是指派生类的函数屏蔽了与其同名的基类函数，只要是与基类同名的成员函数，不管参数列表是否相同，基类函数都会被隐藏。

```
#include <iostream>
using namespace std;

class Base
{
public:
    void fun(int tmp, float tmp1) { cout << "Base::fun(int tmp, float tmp1)" << endl; }
};

class Derive : public Base
{
public:
    void fun(int tmp) { cout << "Derive::fun(int tmp)" << endl; } // 隐藏基类中的同名函数
};

int main()
{
    Derive ex;
    ex.fun(1);       // Derive::fun(int tmp)
    ex.fun(1, 0.01); // error: candidate expects 1 argument, 2 provided
    return 0;
}

```

说明: 上述代码中 `ex.fun(1, 0.01);` 出现错误，说明派生类中将基类的同名函数隐藏了。若是想调用基类中的同名函数，可以加上类型名指明 `ex.Base::fun(1, 0.01);`，这样就可以调用基类中的同名函数。

3. 函数重写（覆盖）：
   函数覆盖是指派生类中存在重新定义的函数。函数名、参数列表、返回值类型都必须同基类中被重写的函数一致，只有函数体不同。派生类调用时会调用派生类的重写函数，不会调用被重写函数。重写的基类中被重写的函数必须有 `virtual` 修饰。

```
#include <iostream>
using namespace std;

class Base
{
public:
    virtual void fun(int tmp) { cout << "Base::fun(int tmp) : " << tmp << endl; }
};

class Derived : public Base
{
public:
    virtual void fun(int tmp) { cout << "Derived::fun(int tmp) : " << tmp << endl; } // 重写基类中的 fun 函数
};
int main()
{
    Base *p = new Derived();
    p->fun(3); // Derived::fun(int) : 3
    return 0;
}

```

4. 重写和重载的区别：

* 范围区别：对于类中函数的重载或者重写而言，重载发生在同一个类的内部，重写发生在不同的类之间（子类和父类之间）。
* 参数区别：重载的函数需要与原函数有相同的函数名、不同的参数列表，不关注函数的返回值类型；重写的函数的函数名、参数列表和返回值类型都需要和原函数相同，父类中被重写的函数需要有 `virtual` 修饰。
* `virtual` 关键字：重写的函数基类中必须有 `virtual` 关键字的修饰，重载的函数可以有 `virtual` 关键字的修饰也可以没有。

5. 隐藏和重写，重载的区别：

* 范围区别：隐藏与重载范围不同，隐藏发生在不同类中。
* 参数区别：隐藏函数和被隐藏函数参数列表可以相同，也可以不同，但函数名一定相同；当参数不同时，无论基类中的函数是否被 `virtual` 修饰，基类函数都是被隐藏，而不是重写。
* 利用重写可以实现多态，而隐藏不可以。如果使用基类指针 `p` 指向派生类对象，利用这个指针调用函数时，对于隐藏的函数，会根据指针的类型去调用函数；对于重写的函数，会根据指针所指对象的类型去调用函数。重写必须使用 `virtual` 关键字，此时会更改派生类虚函数表的表项。
* 隐藏是发生在编译时，即在编译时由编译器实现隐藏，而重写一般发生运行时，即运行时会查找类的虚函数表，决定调用函数接口。

参考资料：

* [C++ Programming: Method Overriding Vs. Method Hiding](https://leetcode.cn/link/?target=http://ixodoi.expertscolumn.com/article/c-programming-method-overriding-vs-method-hiding)
* [C++中的函数隐藏机制](https://leetcode.cn/link/?target=https://blog.csdn.net/niu91/article/details/109485455)
* [Object Oriented Programming in C++](https://leetcode.cn/link/?target=https://www.***.org/object-oriented-programming-in-cpp/)


#### 03. 多态及其实现方法 5

面试高频指数：★★★★★

1. 多态的概念：
   多态就是不同继承类的对象，对同一消息做出不同的响应，基类的指针指向或绑定到派生类的对象，使得基类指针呈现不同的表现方式。在基类的函数前加上 `virtual` 关键字，在派生类中重写该函数，运行时将会根据对象的实际类型来调用相应的函数。如果对象类型是派生类，就调用派生类的函数；如果对象类型是基类，就调用基类的函数。
   程序示例如下:

```
#include <iostream>
using namespace std;

class Base
{
public:
	virtual void fun() { cout << "Base::fun()" << endl; }

	virtual void fun1() { cout << "Base::fun1()" << endl; }

	virtual void fun2() { cout << "Base::fun2()" << endl; }
};
class Derive : public Base
{
public:
	void fun() { cout << "Derive::fun()" << endl; }

	virtual void D_fun1() { cout << "Derive::D_fun1()" << endl; }

	virtual void D_fun2() { cout << "Derive::D_fun2()" << endl; }
};
int main()
{
	Base *p = new Derive();
	p->fun(); // Derive::fun() 调用派生类中的虚函数
	return 0;
}

```


2. 多态的实现原理:
   多态是通过虚函数实现的，虚函数的地址保存在虚函数表中，虚函数表的地址保存在含有虚函数的类的实例对象的内存空间中。

* 在类中用 `virtual` 关键字声明的函数叫做虚函数；
* 存在虚函数的类都有一个虚函数表，当创建一个该类的对象时，该对象有一个指向虚函数表的虚表指针（虚函数表和类对应的，虚表指针是和对象对应）；
* 当基类指针指向派生类对象，基类指针调用虚函数时，该基类指针指的虚表指针实际指向派生类虚函数表，通过遍历虚表，寻找相应的虚函数然后调用执行。
  基类的虚函数表如下图所示：
* ![4_3_1.png](https://pic.leetcode-cn.com/1661223701-LHxbLq-4_3_1.png)
* 派生类的对象虚函数表如下：
* ![4_3_2.png](https://pic.leetcode-cn.com/1661223754-KTbnHb-4_3_2.png)

简单解释：当基类的指针指向派生类的对象时，通过派生类的对象的虚表指针找到虚函数表（派生类的对象虚函数表），进而找到相应的虚函数 `Derive::f()` 进行调用。

3. 多态的总结:
   根据上述的结论，我们可以知道虚函数的调用是在运行时决定，是由本身所指向的对象所决定的。

* 如果使用虚函数，基类指针指向派生类对象并调用对象方法时，使用的是子类的方法;
* 如果未使用虚函数，则是普通的隐藏，则基类指针指向派生类对象时，使用的是基类的方法（与指针类型看齐）
* 基类指针能指向派生类对象，但是派生类指针不能指向基类对象

参考资料：

* [C++ Programming: Method Overriding Vs. Method Hiding](https://leetcode.cn/link/?target=http://ixodoi.expertscolumn.com/article/c-programming-method-overriding-vs-method-hiding)
* [C++中的函数隐藏机制](https://leetcode.cn/link/?target=https://blog.csdn.net/niu91/article/details/109485455)
* [Object Oriented Programming in C++](https://leetcode.cn/link/?target=https://www.***.org/object-oriented-programming-in-cpp/)


#### 04. 虚函数和纯虚函数详解 5

面试高频指数：★★★★★

1. 虚函数：
   被 `virtual` 关键字修饰的成员函数，`C++` 的虚函数在运行时动态绑定，从而实现多态。

```
#include <iostream>
using namespace std;

class A
{
public:
    virtual void v_fun() // 虚函数
    {
        cout << "A::v_fun()" << endl;
    }
};
class B : public A
{
public:
    void v_fun()
    {
        cout << "B::v_fun()" << endl;
    }
};
int main()
{
    A *p = new B();
    p->v_fun(); // B::v_fun()
    return 0;
}

```

2. 纯虚函数：

* 纯虚函数在类中声明时，用 `virtual` 关键字修饰且加上 `=0`，且没有函数的具体实现；
* 含有纯虚函数的类称为抽象类（只要含有纯虚函数这个类就是抽象类），类中只有接口定义，没有具体的实现方法；
* 继承纯虚函数的派生类，如果没有完全实现基类纯虚函数，依然是抽象类，不能实例化对象。
  对于抽象类需要说明的是:
* 抽象类对象不能作为函数的参数，不能创建对象，不能作为函数返回类型；
* 可以声明抽象类指针，可以声明抽象类的引用；
* 抽象类只能作为基类来使用，其纯虚函数的实现由派生类给出。如果派生类中没有重新定义纯虚函数，而只是继承基类的纯虚函数，则这个派生类仍然还是一个抽象类。如果派生类中给出了基类纯虚函数的实现，则该派生类就不再是抽象类了，它是一个可以建立对象的具体的类。

纯虚函数的作用：含有纯虚函数的基类要求任何派生类都要定义自己的实现方法，以实现多态性。实现了纯虚函数的子类，该纯虚函数在子类中就变成了虚函数。定义纯虚函数是为了实现统一的接口属性，用来规范派生类的接口属性，也即强制要求继承这个类的程序员必须实现这个函数。纯虚函数的意义在于，让所有的类对象（主要是派生类对象）都可以要求实现纯虚函数的属性，在面对对象设计中非常有用的一个特性。

参考资料：

* [C++ 虚函数、纯虚函数](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/37331092)
* [C++胎教：虚函数，虚析构函数，纯虚函数](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/202551705)
* [Pure Virtual Destructor in C++](https://leetcode.cn/link/?target=https://www.***.org/pure-virtual-destructor-c/?ref=gcse)


#### 05. 虚函数和纯虚函数的区别 5

面试高频指数：★★★★★

* 虚函数和纯虚函数可以出现在同一个类中，该类称为抽象基类（含有纯虚函数的类称为抽象基类）。
* 使用方式不同：虚函数可以直接使用，纯虚函数必须在派生类中实现后才能使用；
* 定义形式不同：虚函数在定义时在普通函数的基础上加上 `virtual` 关键字，纯虚函数定义时除了加上 `virtual` 关键字还需要加上 `=0`;
* 虚函数必须实现，否则编译器会报错；
* 对于实现纯虚函数的派生类，该纯虚函数在派生类中被称为虚函数，虚函数和纯虚函数都可以在派生类中重写；
* 析构函数最好定义为虚函数，特别是对于含有继承关系的类；析构函数可以定义为纯虚函数，此时，其所在的类为抽象基类，不能创建实例化对象。

参考资料：

* [C++ 虚函数和纯虚函数的区别](https://leetcode.cn/link/?target=https://www.runoob.com/w3cnote/cpp-virtual-functions.html)
* [Pure Virtual Destructor in C++](https://leetcode.cn/link/?target=https://www.***.org/pure-virtual-destructor-c/?ref=gcse)
