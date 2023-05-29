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

#### 06. 虚函数的实现机制 5

面试高频指数：★★★★★

1. 虚函数的实现原理:
   实现机制：虚函数通过虚函数表来实现。虚函数的地址保存在虚函数表中，在类的对象所在的内存空间中，保存了指向虚函数表的指针（称为“虚表指针”），通过虚表指针可以找到类对应的虚函数表。虚函数表解决了基类和派生类的继承问题和类中成员函数的覆盖问题，当用基类的指针来操作一个派生类的时候，这张虚函数表就指明了实际应该调用的函数。

* 每个使用虚函数的类（或者从使用虚函数的类派生）都有自己的虚函数表。该表是编译器在编译时设置的静态数组，一般我们称为 `vtable`。虚函数表包含可由该类调用的虚函数，此表中的每个条目是一个函数指针，指向该类可访问的虚函数。
* 每个对象在创建时，编译器会为对象生成一个指向该类的虚函数表的指针，我们称之为 `vptr`。`vptr` 在创建类实例时自动设置，以便指向该类的虚拟表。如果对象（或者父类）中含有虚函数，则编译器一定会为其分配一个 `vptr`；如果对象不包含（父类也不含有），此时编译器则不会为其分配 `vptr`。与 `this` 指针不同，`this` 指针实际上是编译器用来解析自引用的函数参数，`vptr` 是一个真正的指针。

虚函数表相关知识点：

* 虚函数表存放的内容：类的虚函数的地址。
* 虚函数表建立的时间：编译阶段，即程序的编译过程中会将虚函数的地址放在虚函数表中。
* 虚表指针保存的位置：虚表指针存放在对象的内存空间中最前面的位置，这是为了保证正确取到虚函数的偏移量。
* 虚函数表和类绑定，虚表指针和对象绑定。即类的不同的对象的虚函数表是一样的，但是每个对象在创建时都有自己的虚表指针 `vptr`，来指向类的虚函数表 `vtable`。

实例：
无虚函数覆盖的情况：

```
#include <iostream>
using namespace std;

class Base
{
public:
    virtual void B_fun1() { cout << "Base::B_fun1()" << endl; }
    virtual void B_fun2() { cout << "Base::B_fun2()" << endl; }
    virtual void B_fun3() { cout << "Base::B_fun3()" << endl; }
};

class Derive : public Base
{
public:
    virtual void D_fun1() { cout << "Derive::D_fun1()" << endl; }
    virtual void D_fun2() { cout << "Derive::D_fun2()" << endl; }
    virtual void D_fun3() { cout << "Derive::D_fun3()" << endl; }
};
int main()
{
    Base *p = new Derive();
    p->B_fun1(); // Base::B_fun1()
    return 0;
}

```

基类和派生类的继承关系：

![4_8_1.png](https://pic.leetcode-cn.com/1661223939-pVNuOM-4_8_1.png)

基类的虚函数表：

![4_3_1.png](https://pic.leetcode-cn.com/1661223950-bjKjYx-4_3_1.png)

派生类的虚函数表：

![4_3_2.png](https://pic.leetcode-cn.com/1661223960-YGKHNe-4_3_2.png)

2. 虚拟函数表指针 `vptr`:
   带有虚函数的类，通过该类所隐含的虚函数表来实现多态机制，该类的每个对象均具有一个指向本类虚函数表的指针，这一点并非 `C++` 标准所要求的，而是编译器所采用的内部处理方式。实际应用场景下，不同平台、不同编译器厂商所生成的虚表指针在内存中的布局是不同的，有些将虚表指针置于对象内存中的开头处，有些则置于结尾处。如果涉及多重继承和虚继承，情况还将更加复杂。因此永远不要使用 `C` 语言的方式调用 `memcpy()` 之类的函数复制对象，而应该使用初始化（构造和拷构）或赋值的方式来复制对象。
   程序示例，我们通过对象内存的开头处取出 `vptr`，并遍历对象虚函数表。

```
#include <iostream>
#include <memory>
using namespace std;
 
 
typedef void (*func)(void);

class A {
public:
	void f() { cout << "A::f" << endl; }
	void g() { cout << "A::g" << endl; }
	void h() { cout << "A::h" << endl; }
};

class Base {
public:
	virtual void f() { cout << "Base::f" << endl; }
	virtual void g() { cout << "Base::g" << endl; }
	virtual void h() { cout << "Base::h" << endl; }
};

class Derive: public Base {
public:
	void f() { cout << "Derive::f" << endl; }
    void g() { cout << "Derive::g" << endl; }
	void h() { cout << "Derive::h" << endl; }
};
 
int main() 
{
	Base base;
    Derive derive;
	//获取vptr的地址，运行在gcc  x64环境下，所以将指针按unsigned long *大小处理
    //另外基于C++的编译器应该是保证虚函数表的指针存在于对象实例中最前面的位置
	unsigned long* vPtr = (unsigned long*)(&base);
	//获取vTable 首个函数的地址
	func vTable_f = (func)*(unsigned long*)(*vPtr);
	//获取vTable 第二个函数的地址
	func vTable_g = (func)*((unsigned long*)(*vPtr) + 1);//加1 ，按步进计算
	func vTable_h = (func)*((unsigned long*)(*vPtr) + 2);//同上
	vTable_f();
	vTable_g();
	vTable_h();
    vPtr = (unsigned long*)(&derive);
	//获取vTable 首个函数的地址
	vTable_f = (func)*(unsigned long*)(*vPtr);
	//获取vTable 第二个函数的地址
	vTable_g = (func)*((unsigned long*)(*vPtr) + 1);//加1 ，按步进计算
	vTable_h = (func)*((unsigned long*)(*vPtr) + 2);//同上
	vTable_f();
	vTable_g();
	vTable_h();
    cout<<sizeof(A)<<endl;
    cout<<sizeof(base)<<endl;
    cout<<sizeof(derive)<<endl;
	return 0;
}
/*
Base::f
Base::g
Base::h
Derive::f
Derive::g
Derive::h
1
8
8
*/

```

我们可以看到同样的函数实现，对象在分配空间时，编译器会为对象多分配一个 `vptr` 指针的空间。

3. 虚函数的使用场景:

* 构造函数不能为虚函数：构造函数不能定义为虚函数。构造函数是在实例化对象的时候进行调用，如果此时将构造函数定义成虚函数，需要通过访问该对象所在的内存空间才能进行虚函数的调用（因为需要通过指向虚函数表的指针调用虚函数表，虽然虚函数表在编译时就有了，但是没有虚函数的指针，虚函数的指针只有在创建了对象才有），但是此时该对象还未创建，便无法进行虚函数的调用。所以构造函数不能定义成虚函数。
* 析构函数为虚函数：一般建议析构函数定义成虚函数，这样做可以有效是防止内存泄漏，实际应用时当基类的指针或者引用指向或绑定到派生类的对象时，如果未将基类的析构函数定义成虚函数，当我们对基类指针执行 `delete` 操作时，此时只会调用基类的析构函数，将基类的成员所占的空间释放掉，而派生类中特有的资源就会无法释放而导致内存泄漏。
* `static` 函数不能定义为虚函数。

参考资料：

* [c++ vptr和vptr_table](https://leetcode.cn/link/?target=https://www.jianshu.com/p/3cccced44b58?u_atoken=e8ede029-5293-407a-9985-526c394f9b8a&u_asession=01bIPvXx9SY5_xBkApG0jxuFquU3CNI8UDsgCDSdHq2i2mjap72ElAso_66tm-TDNZX0KNBwm7Lovlpxjd_P_q4JsKWYrT3W_NKPr8w6oU7K-SQrcSpU2wKWEMjf4_ystnslvTX-jMTLEIhdGFg3rxgWBkFo3NEHBv0PZUm6pbxQU&u_asig=0571xFqT6ytNlYS2FmxKjAUdsqIiXpCEpA3oVT5M8VvEmArNbD__2GdaNqCpJhE6sKEWSbWvLurnKkQM8UDw9dpq1QaT-QMloEqiRNkDTkodMUEoCRvcqQemB454***DsuJ2oQa7hZhyN55PkQ5xaBoj0AhcSH1wl0eqC5j_MoEi39JS7q8ZD7Xtz2Ly-b0kmuyAKRFSVJkkdwVUnyHAIJzYB6zf84piLcxhHyLSCEfChSMikju3ElgVHUh31mnWFE6FPw117USKdEPc8n7HkzU-3h9VXwMyh6PgyDIVSG1W_16QxpFtJKKMbx9Ow-IaNKL6GwjCufiNkuwxPu3TW8Jdu-bki0QJggyafeAwVHEi-9BZd-asvIzjeFlQSnb_AWmWspDxyAEEo4kbsryBKb9Q&u_aref=D9qKzka2hg16cYfkVO8qiMiPKeU%3D)
* [C++基础——虚指针（vptr）与虚基表（vtable）](https://leetcode.cn/link/?target=https://blog.csdn.net/qq_25065595/article/details/107372446)
* [C++对象模型3——vptr的位置、手动调用虚函数、从汇编代码看普通调用和多态调用](https://leetcode.cn/link/?target=https://blog.csdn.net/Master_Cui/article/details/114983811)
* [C++:对象模型：关于vptr（虚指针）和vtbl](https://leetcode.cn/link/?target=https://blog.csdn.net/weixin_43589450/article/details/107393198)
* [Virtual Function in C++](https://leetcode.cn/link/?target=https://www.***.org/virtual-function-cpp/?ref=gcse)
* [Polymorphism in C++](https://leetcode.cn/link/?target=https://www.***.org/polymorphism-in-c/)
* [C++ 虚函数和纯虚函数的区别](https://leetcode.cn/link/?target=https://www.runoob.com/w3cnote/cpp-virtual-functions.html)

#### 07. 构造函数、析构函数是否可以定义成虚函数 5

面试高频指数：★★★★★

1. 构造函数一般不定义为虚函数:

* 从存储空间的角度考虑：构造函数是在实例化对象的时候进行调用，如果此时将构造函数定义成虚函数，需要通过访问该对象所在的内存空间才能进行虚函数的调用（因为需要通过指向虚函数表的指针调用虚函数表，虽然虚函数表在编译时就有了，但是没有虚函数的指针，虚函数的指针只有在创建了对象才有），但是此时该对象还未创建，便无法进行虚函数的调用。所以构造函数不能定义成虚函数。
* 从使用的角度考虑：虚函数是基类的指针指向派生类的对象时，通过该指针实现对派生类的虚函数的调用，构造函数是在创建对象时自动调用的。
* 从实现上考虑：虚函数表指针是在创建对象之后才有的，因此不能定义成虚函数。
* 从类型上考虑：在创建对象时需要明确其类型。

2. 析构函数一般定义成虚函数：
   析构函数定义成虚函数是为了防止内存泄漏，因为当基类的指针或者引用指向或绑定到派生类的对象时，如果未将基类的析构函数定义成虚函数，会调用基类的析构函数，那么只能将基类的成员所占的空间释放掉，派生类中特有的就会无法释放内存空间导致内存泄漏。
   比如以下程序示例:

```
#include <iostream>

using namespace std;

class A {
private:
    int val;
public:
    ~A() {
        cout<<"A destroy!"<<endl;
    }
};

class B: public  A {
private:
    int *arr;
public:
    B() {
        arr = new int[10];
    }
    ~B() {
        cout<<"B destroy!"<<endl;
        delete arr;
    }
};

int main() {
    A *base = new B();
    delete base;
    return 0;
}
// A destroy!

```

我们可以看到如果析构函数不定义为虚函数，此时执行析构的只有基类，而派生类没有完成析构。我们将析构函数定义为虚函数，在执行析构时，则根据对象的类型来执行析构函数，此时派生类的资源得到释放。

```
#include <iostream>

using namespace std;

class A {
private:
    int val;
public:
    virtual ~A() {
        cout<<"A destroy!"<<endl;
    }
};

class B: public  A {
private:
    int *arr;
public:
    B() {
        arr = new int[10];
    }
    virtual ~B() {
        cout<<"B destroy!"<<endl;
        delete arr;
    }
};

int main() {
    A *base = new B();
    delete base;
    return 0;
}
// B destroy!
// A destroy!

```

参考资料：

* [默认构造函数](https://leetcode.cn/link/?target=https://baike.baidu.com/item/%E9%BB%98%E8%AE%A4%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0/10132851)
* [Default Constructors in C++](https://leetcode.cn/link/?target=https://www.***.org/default-constructors-in-cpp/)
* [Default constructors (C++ only)](https://leetcode.cn/link/?target=https://www.ibm.com/docs/en/zos/2.2.0?topic=only-default-constructors-c)
* [Default constructors](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/language/default_constructor)

#### 08. 多重继承的常见问题及避免方法 5

面试高频指数：★★★★★

多重继承（多继承）：是指从多个直接基类中产生派生类。多重继承容易出现命名冲突和数据冗余问题。
程序示例如下:

```
#include <iostream>
using namespace std;

// 间接基类
class Base1
{
public:
    int var1;
};

// 直接基类
class Base2 : public Base1
{
public:
    int var2;
};

// 直接基类
class Base3 : public Base1
{
public:
    int var3;
};

// 派生类
class Derive : public Base2, public Base3
{
public:
    void set_var1(int tmp) { var1 = tmp; } // error: reference to 'var1' is ambiguous. 命名冲突
    void set_var2(int tmp) { var2 = tmp; }
    void set_var3(int tmp) { var3 = tmp; }
    void set_var4(int tmp) { var4 = tmp; }

private:
    int var4;
};

int main()
{
    Derive d;
    return 0;
}

```

上述程序的继承关系如下：（菱形继承）

![4_15_1.png](https://pic.leetcode-cn.com/1661310999-nOjItm-4_15_1.png)

上述代码中存的问题：
对于派生类 `Derive` 上述代码中存在直接继承关系和间接继承关系。

* 直接继承：`Base2` 、`Base3`
* 间接继承：`Base1`
  对于派生类中继承的的成员变量 `var1` ，从继承关系来看，实际上保存了两份，一份是来自基类 `Base2`，一份来自基类 `Base3`。因此，出现了命名冲突。

1. 解决方法：显式声明出现冲突的成员变量来源于哪个类。

```
#include <iostream>
using namespace std;

// 间接基类
class Base1
{
public:
    int var1;
};

// 直接基类
class Base2 : public Base1
{
public:
    int var2;
};

// 直接基类
class Base3 : public Base1
{
public:
    int var3;
};

// 派生类 
class Derive : public Base2, public Base3
{
public:
    void set_var1(int tmp) { Base2::var1 = tmp; } // 这里声明成员变量来源于类 Base2，当然也可以声明来源于类 Base3
    void set_var2(int tmp) { var2 = tmp; }
    void set_var3(int tmp) { var3 = tmp; }
    void set_var4(int tmp) { var4 = tmp; }

private:
    int var4;
};

int main()
{
    Derive d;
    return 0;
}

```

2. 解决方法： 虚继承

```
#include <iostream>
using namespace std;

// 间接基类，即虚基类
class Base1
{
public:
    int var1;
};

// 直接基类 
class Base2 : virtual public Base1 // 虚继承
{
public:
    int var2;
};

// 直接基类 
class Base3 : virtual public Base1 // 虚继承
{
public:
    int var3;
};

// 派生类
class Derive : public Base2, public Base3
{
public:
    void set_var1(int tmp) { var1 = tmp; } 
    void set_var2(int tmp) { var2 = tmp; }
    void set_var3(int tmp) { var3 = tmp; }
    void set_var4(int tmp) { var4 = tmp; }

private:
    int var4;
};

int main()
{
    Derive d;
    return 0;
}

```

类之间的继承关系：

![4_15_2.png](https://pic.leetcode-cn.com/1661311024-kBHgoW-4_15_2.png)

由于使用多重继承很容易出现二义性的问题，将使得程序调试和维护工作变得非常复杂，`C++` 之后的很多面向对象的编程语言，例如 `Java、C#、PHP` 等，都不支持多继承。

参考资料：

* [C++虚继承和虚基类详解](https://leetcode.cn/link/?target=http://c.biancheng.net/view/2280.html)
* [C++虚继承详解](https://leetcode.cn/link/?target=https://blog.csdn.net/youaremyalllove/article/details/124324115)
* [C++ Multiple, Multilevel and Hierarchical Inheritance](https://leetcode.cn/link/?target=https://www.programiz.com/cpp-programming/multilevel-multiple-inheritance)
* [Multiple Inheritance in C++](https://leetcode.cn/link/?target=https://www.javatpoint.com/multiple-inheritance-in-cpp)
* [Multiple Inheritance in C++](https://leetcode.cn/link/?target=https://www.***.org/multiple-inheritance-in-c/)

#### 09. 深拷贝和浅拷贝的区别 5

面试高频指数：★★★★★

如果一个类拥有资源，该类的对象进行复制时，如果资源重新分配，就是深拷贝，否则就是浅拷贝。

* 深拷贝：该对象和原对象占用不同的内存空间，既拷贝存储在栈空间中的内容，又拷贝存储在堆空间中的内容。
* 浅拷贝：该对象和原对象占用同一块内存空间，仅拷贝类中位于栈空间中的内容。
  ![4_25_1.png](https://pic.leetcode-cn.com/1661311283-TOfEBS-4_25_1.png)

当类的成员变量中有指针变量时，最好使用深拷贝。因为当两个对象指向同一块内存空间，如果使用浅拷贝，当其中一个对象的删除后，该块内存空间就会被释放，另外一个对象指向的就是垃圾内存。

* **浅拷贝实例** ：
  ```
  #include <iostream>

  using namespace std;

  class Test
  {
  private:
  	int *p;

  public:
  	Test(int tmp)
  	{
  		this->p = new int(tmp);
  		cout << "Test(int tmp)" << endl;
  	}
  	~Test()
  	{
  		if (p != NULL)
  		{
  			delete p;
  		}
  		cout << "~Test()" << endl;
  	}
  };

  int main()
  {
  	Test ex1(10);
  	Test ex2 = ex1; 
  	return 0;
  }
  /*
  运行结果：
  Test(int tmp)
  ~Test()
  */

  ```

说明：上述代码中，类对象 `ex1、ex2` 实际上是指向同一块内存空间，对象析构时，`ex2` 先将内存释放了一次，之后析构对象 `ex1` 时又将这块已经被释放过的内存再释放一次。对同一块内存空间释放了两次，会导致程序崩溃。

* 深拷贝实例：

```
#include <iostream>

using namespace std;

class Test
{
private:
	int *p;

public:
	Test(int tmp)
	{
		p = new int(tmp);
		cout << "Test(int tmp)" << endl;
	}
	~Test()
	{
		if (p != NULL)
		{
			delete p;
		}
		cout << "~Test()" << endl;
	}
	Test(const Test &tmp) // 定义拷贝构造函数
	{
		p = new int(*tmp.p);
		cout << "Test(const Test &tmp)" << endl;
	}

};

int main()
{
	Test ex1(10);
	Test ex2 = ex1; 
	return 0;
}
/*
Test(int tmp)
Test(const Test &tmp)
~Test()
~Test()
*/

```

* 编译器生成的默认拷贝函数均大部分都是浅拷贝，所有在特定场景下需要禁止编译器生成默认拷贝构造函数。在遇到需要使用堆内存的构造函数中，我们需要特别注意浅拷贝和深拷贝的使用方式，防止两个不同的对象指向同一块内存区域。

参考资料:

* [Shallow Copy and Deep Copy in C++](https://leetcode.cn/link/?target=https://www.***.org/shallow-copy-and-deep-copy-in-c/)
* [What is the difference between a deep copy and a shallow copy?](https://leetcode.cn/link/?target=https://stackoverflow.com/questions/184710/what-is-the-difference-between-a-deep-copy-and-a-shallow-copy)
* [Deep Copy C++](https://leetcode.cn/link/?target=https://linuxhint.com/deep-copy-cpp/)

#### 10. 单继承和多继承的虚函数表结构 4

面试高频指数：★★★★☆

* 编译器将虚函数表的指针放在类的实例对象的内存空间中，该对象调用该类的虚函数时，通过指针找到虚函数表，根据虚函数表中存放的虚函数的地址找到对应的虚函数。
* 如果派生类没有重新定义基类的虚函数 `A`，则派生类的虚函数表中保存的是基类的虚函数 `A` 的地址，也就是说基类和派生类的虚函数 `A` 的地址是一样的。
* 如果派生类重写了基类的某个虚函数 `B`，则派生的虚函数表中保存的是重写后的虚函数 `B` 的地址，也就是说虚函数 `B` 有两个版本，分别存放在基类和派生类的虚函数表中。
* 如果派生类重新定义了新的虚函数 `C`，派生类的虚函数表保存新的虚函数 `C` 的地址。

1. 单继承无虚函数覆盖的情况：

```
#include <iostream>
#include <memory>
using namespace std;
 
 
typedef void (*func)(void);

#include <iostream>
using namespace std;

class Base
{
public:
    virtual void B_fun1() { cout << "Base::B_fun1()" << endl; }
    virtual void B_fun2() { cout << "Base::B_fun2()" << endl; }
    virtual void B_fun3() { cout << "Base::B_fun3()" << endl; }
};

class Derive : public Base
{
public:
    virtual void D_fun1() { cout << "Derive::D_fun1()" << endl; }
    virtual void D_fun2() { cout << "Derive::D_fun2()" << endl; }
    virtual void D_fun3() { cout << "Derive::D_fun3()" << endl; }
};

void printVtable(unsigned long *vptr, int offset) {
	func fn = (func)*((unsigned long*)(*vptr) + offset);
	fn();
}

int main()
{
    Base *p = new Derive();
    p->B_fun1(); // Base::B_fun1()
	unsigned long* vPtr = (unsigned long*)(p);
	printVtable(vPtr, 0);
	printVtable(vPtr, 1);
	printVtable(vPtr, 2);
	printVtable(vPtr, 3);
	printVtable(vPtr, 3);
	printVtable(vPtr, 4);
    cout<<sizeof(Base)<<endl; // 8
    cout<<sizeof(Derive)<<endl; // 8
    return 0;
}
/*
Base::B_fun1()
Base::B_fun1()
Base::B_fun2()
Base::B_fun3()
Derive::D_fun1()
Derive::D_fun2()
Derive::D_fun3()
8
8
*/

```

基类和派生类的继承关系：

![4_8_1.png](https://pic.leetcode-cn.com/1661224138-RbKIMW-4_8_1.png)

基类的虚函数表：

![4_3_1.png](https://pic.leetcode-cn.com/1661224148-AzSusP-4_3_1.png)

派生类的虚函数表：

![4_3_2.png](https://pic.leetcode-cn.com/1661224158-oAsuQx-4_3_2.png)

* 虚函数按照声明顺序放在虚函数表里面。
* 父类的虚函数在子类的虚函数前面。

2. 单继承有虚函数覆盖的情况：

```
#include <iostream>
#include <memory>
using namespace std;
 
 
typedef void (*func)(void);

class Base
{
public:
    virtual void fun1() { cout << "Base::fun1()" << endl; }
    virtual void B_fun2() { cout << "Base::B_fun2()" << endl; }
    virtual void B_fun3() { cout << "Base::B_fun3()" << endl; }
};

class Derive : public Base
{
public:
    virtual void fun1() { cout << "Derive::fun1()" << endl; }
    virtual void D_fun2() { cout << "Derive::D_fun2()" << endl; }
    virtual void D_fun3() { cout << "Derive::D_fun3()" << endl; }
};

void printVtable(unsigned long *vptr, int offset) {
	func fn = (func)*((unsigned long*)(*vptr) + offset);
	fn();
}

int main()
{
    Base *p = new Derive();
	unsigned long* vPtr = (unsigned long*)(p);
	printVtable(vPtr, 0);
	printVtable(vPtr, 1);
	printVtable(vPtr, 2);
	printVtable(vPtr, 3);
	printVtable(vPtr, 4);
    cout<<sizeof(Base)<<endl; // 8
    cout<<sizeof(Derive)<<endl; // 8
    return 0;
}

/*
Derive::fun1()
Base::B_fun2()
Base::B_fun3()
Derive::D_fun2()
Derive::D_fun3()
8
8
*/

```

派生类的虚函数表：

![4_9_1.png](https://pic.leetcode-cn.com/1663130295-EvbThl-4_9_1.png)

3. 多继承无虚函数覆盖的情况：

```
#include <iostream>
using namespace std;

class Base1
{
public:
    virtual void B1_fun1() { cout << "Base1::B1_fun1()" << endl; }
    virtual void B1_fun2() { cout << "Base1::B1_fun2()" << endl; }
    virtual void B1_fun3() { cout << "Base1::B1_fun3()" << endl; }
};
class Base2
{
public:
    virtual void B2_fun1() { cout << "Base2::B2_fun1()" << endl; }
    virtual void B2_fun2() { cout << "Base2::B2_fun2()" << endl; }
    virtual void B2_fun3() { cout << "Base2::B2_fun3()" << endl; }
};
class Base3
{
public:
    virtual void B3_fun1() { cout << "Base3::B3_fun1()" << endl; }
    virtual void B3_fun2() { cout << "Base3::B3_fun2()" << endl; }
    virtual void B3_fun3() { cout << "Base3::B3_fun3()" << endl; }
};

class Derive : public Base1, public Base2, public Base3
{
public:
    virtual void D_fun1() { cout << "Derive::D_fun1()" << endl; }
    virtual void D_fun2() { cout << "Derive::D_fun2()" << endl; }
    virtual void D_fun3() { cout << "Derive::D_fun3()" << endl; }
};

typedef void (*func)(void);

void printVtable(unsigned long *vptr, int offset) {
	func fn = (func)*((unsigned long*)(*vptr) + offset);
	fn();
}

int main(){
    Base1 *p = new Derive();
    unsigned long* vPtr = (unsigned long*)(p);
	printVtable(vPtr, 0);
	printVtable(vPtr, 1);
	printVtable(vPtr, 2);
	printVtable(vPtr, 3);
	printVtable(vPtr, 4);
	printVtable(vPtr, 5);
	vPtr++;
	printVtable(vPtr, 0);
	printVtable(vPtr, 1);
	printVtable(vPtr, 2);
	vPtr++;
	printVtable(vPtr, 0);
	printVtable(vPtr, 1);
	printVtable(vPtr, 2);
    cout<<sizeof(Base1)<<endl; // 8
	cout<<sizeof(Base2)<<endl; // 8
	cout<<sizeof(Base3)<<endl; // 8
    cout<<sizeof(Derive)<<endl; // 8
    return 0;
}

/*
Base1::B1_fun1()
Base1::B1_fun2()
Base1::B1_fun3()
Derive::D_fun1()
Derive::D_fun2()
Derive::D_fun3()
Base2::B2_fun1()
Base2::B2_fun2()
Base2::B2_fun3()
Base3::B3_fun1()
Base3::B3_fun2()
Base3::B3_fun3()
8
8
8
24
*/

```

派生类的虚函数表：（基类的顺序和声明的顺序一致）

![4_9_2.png](https://pic.leetcode-cn.com/1661224203-PAsnVw-4_9_2.png)

4. 多继承有虚函数覆盖的情况：

```
#include <iostream>
using namespace std;

class Base1
{
public:
    virtual void fun1() { cout << "Base1::fun1()" << endl; }
    virtual void B1_fun2() { cout << "Base1::B1_fun2()" << endl; }
    virtual void B1_fun3() { cout << "Base1::B1_fun3()" << endl; }
};
class Base2
{
public:
    virtual void fun1() { cout << "Base2::fun1()" << endl; }
    virtual void B2_fun2() { cout << "Base2::B2_fun2()" << endl; }
    virtual void B2_fun3() { cout << "Base2::B2_fun3()" << endl; }
};
class Base3
{
public:
    virtual void fun1() { cout << "Base3::fun1()" << endl; }
    virtual void B3_fun2() { cout << "Base3::B3_fun2()" << endl; }
    virtual void B3_fun3() { cout << "Base3::B3_fun3()" << endl; }
};

class Derive : public Base1, public Base2, public Base3
{
public:
    virtual void fun1() { cout << "Derive::fun1()" << endl; }
    virtual void D_fun2() { cout << "Derive::D_fun2()" << endl; }
    virtual void D_fun3() { cout << "Derive::D_fun3()" << endl; }
};

typedef void (*func)(void);

void printVtable(unsigned long *vptr, int offset) {
	func fn = (func)*((unsigned long*)(*vptr) + offset);
	fn();
}

int main(){
    Base1 *p1 = new Derive();
    Base2 *p2 = new Derive();
    Base3 *p3 = new Derive();
    p1->fun1(); // Derive::fun1()
    p2->fun1(); // Derive::fun1()
    p3->fun1(); // Derive::fun1()
    unsigned long* vPtr = (unsigned long*)(p1);
	printVtable(vPtr, 0);
	printVtable(vPtr, 1);
	printVtable(vPtr, 2);
	printVtable(vPtr, 3);
	printVtable(vPtr, 4);
	vPtr++;
	printVtable(vPtr, 0);
	printVtable(vPtr, 1);
	printVtable(vPtr, 2);
	vPtr++;
	printVtable(vPtr, 0);
	printVtable(vPtr, 1);
	printVtable(vPtr, 2);
    cout<<sizeof(Base1)<<endl; // 8
	cout<<sizeof(Base2)<<endl; // 8
	cout<<sizeof(Base3)<<endl; // 8
    cout<<sizeof(Derive)<<endl; // 8
    return 0;
}

/*
Derive::fun1()
Derive::fun1()
Derive::fun1()
Derive::fun1()
Base1::B1_fun2()
Base1::B1_fun3()
Derive::D_fun2()
Derive::D_fun3()
Derive::fun1()
Base2::B2_fun2()
Base2::B2_fun3()
Derive::fun1()
Base3::B3_fun2()
Base3::B3_fun3()
8
8
8
24
*/

```

基类和派生类的关系：

![4_9_3.png](https://pic.leetcode-cn.com/1661224230-yMQSbY-4_9_3.png)

派生类的虚函数表：

![1.png](https://pic.leetcode.cn/1678845281-gLMsXp-1.png)

参考资料：

* [C++虚函数表分析——参考陈皓版]

#### 11. 如何禁止构造函数的使用 4

面试高频指数：★★★★☆

为类的构造函数增加 `= delete` 修饰符，可以达到虽然声明了构造函数但禁止使用的目的。

```
#include <iostream>

using namespace std;

class A {
public:
    int var1, var2;
    A(){
        var1 = 10;
        var2 = 20;
    }
    A(int tmp1, int tmp2) = delete;
};

int main()
{
    A ex1;  
    A ex2(12,13); // error: use of deleted function 'A::A(int, int)'
    return 0;
}
```

如果我们仅仅将构造函数设置为私有，类内部的成员和友元还可以访问，无法完全禁止。而在 `C++11` 以后，在成员函数声明后加 `"= delete"`则可以禁止该函数的使用，而需要保留的加 `"= default"`。

参考资料：

* [Meaning of = delete after function declaration](https://leetcode.cn/link/?target=https://stackoverflow.com/questions/5513881/meaning-of-delete-after-function-declaration)

#### 12. 什么是类的默认构造函数 4

面试高频指数：★★★★☆

默认构造函数（`default constructor`）就是在没有显式提供初始化式时调用的构造函数。它由不带参数的构造函数，或者为所有的形参提供默认实参的构造函数定义。如果定义某个类的变量时没有提供初始化时就会使用默认构造函数。

1. 用户定义的默认构造函数:

* 用户自定义的不带参数的构造函数:

```
#include <iostream>

using namespace std;

class A
{
public:
    A(){ // 类的默认构造函数
        var = 10;
        c = 'q';
    }
    A(int val = 10)
    int var;
    char c;
};

int main()
{
    A ex;
    cout << ex.c << endl << ex.var << endl;
    return 0;
}
/*
运行结果：
q
10
*/


```

说明：上述程序中定义变量 `ex` 时，未提供任何实参，程序运行时会调用默认的构造函数。

* 用户自定义的构造函数，但为所有形参提供默认值的构造函数:

```
#include <iostream>

using namespace std;

class A
{
public:
    A(int _var = 10, char _c = 'q'){ // 类的默认构造函数
        var = _var;
        c = _c;
    }
    int var;
    char c;
};

int main()
{
    A ex;
    cout << ex.c << endl << ex.var << endl;
    return 0;
}
/*
运行结果：
q
10
*/

```

说明：上述程序中定义变量 `ex` 时，未提供任何实参，程序运行时会调用所有形参提供默认值的构造函数。

2. 编译器自动分配的合成默认构造函数
   如果用户定义的类中没有显式的定义任何构造函数，编译器就会自动为该类型生成默认构造函数，称为合成的默认构造函数。

```
#include <iostream>

using namespace std;

class A
{
public:
    int var;
    char c;
};

int main()
{
    A ex;
    cout << ex.c << endl << ex.var << endl;
    return 0;
}
/*
运行结果：

0
*/

```

此时编译器会自动为 `A` 分配一个默认的构造函数，在上述示例中，类 `A` 中的变量 `c` 默认赋值为 `\0`，`var` 默认赋值为 `0`。
一般情况下，如果类中包含内置或复合类型的成员，则该类就不应该依赖于合成的默认构造函数，它应该定义自己的构造函数来初始化这些成员。多数情况下，编译器为类生成一个公有的默认构造函数，只有下面两种情况例外:

* 一个类显式地声明了任何构造函数，编译器不生成公有的默认构造函数。在这种情况下，如果程序需要一个默认构造函数，需要由类的设计者提供。
* 一个类声明了一个非公有的默认构造函数，编译器不会生成公有的默认构造函数。
  在大多数情况下，`C++` 编译器为未声明构造函数之 `class` 合成一个默认构造函数：
* 如果该类没有任何构造函数，但是包含一个对象类型的成员变量，且该变量有一个显式的默认构造函数；
* 如果该类没有任何构造函数，但是其父类含有显式的默认构造函数；
* 如果该类没有任何构造函数，但是含有（或父类含有）虚函数；
* 如果该类没有任何构造函数，但是带有一个虚基类；

参考资料：

* [默认构造函数](https://leetcode.cn/link/?target=https://baike.baidu.com/item/%E9%BB%98%E8%AE%A4%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0/10132851)
* [Default Constructors in C++](https://leetcode.cn/link/?target=https://www.***.org/default-constructors-in-cpp/)
* [Default constructors (C++ only)](https://leetcode.cn/link/?target=https://www.ibm.com/docs/en/zos/2.2.0?topic=only-default-constructors-c)
* [Default constructors](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/language/default_constructor)

#### 13. 如何减少构造函数开销 4

面试高频指数：★★★★☆

在构造函数时尽量使用类初始化列表，会减少调用默认的构造函数产生的开销，具体原因可以参考本章《为什么用成员初始化列表会快一些？》这个问题。

```
class A
{
private:
    int val;
public:
    A()
    {
        cout << "A()" << endl;
    }
    A(int tmp)
    {
        val = tmp;
        cout << "A(int " << val << ")" << endl;
    }
};
class Test1
{
private:
    A ex;

public:
    Test1(): ex(1)  // 成员列表初始化方式
    {
  
    }
};


```

参考资料：

* [When do we use Initializer List in C++?](https://leetcode.cn/link/?target=https://www.***.org/when-do-we-use-initializer-list-in-c/)
* [Constructors and member initializer lists](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/language/constructor)
* [What are initializer lists in C++?](https://leetcode.cn/link/?target=https://www.educative.io/answers/what-are-initializer-lists-in-cpp)

#### 14. C++ 类对象的初始化顺序 4

面试高频指数：★★★★☆

1. 构造函数调用顺序：

* 按照派生类继承基类的顺序，即派生列表中声明的继承顺序，依次调用基类的构造函数；
* 在有虚继承和一般继承存在的情况下，优先虚继承。比如虚继承：`class C: public B, virtual public A`，此时应当先调用 `A` 的构造函数，再调用 `B` 的构造函数。
* 按照派生类中成员变量的声明顺序，依次调用派生类中成员变量所属类的构造函数；
* 执行派生类自身的构造函数。

2. 类对象的初始化顺序：

* 按照构造函数的调用顺序，调用基类的构造函数
* 按照成员变量的声明顺序，调用成员变量的构造函数函数，成员变量的初始化顺序与声明顺序有关；
* 调用该类自身的构造函数；
* 析构顺序和类对象的初始化顺序相反。

```
#include <iostream>
using namespace std;

class A
{
public:
    A() { cout << "A()" << endl; }
    ~A() { cout << "~A()" << endl; }
};

class B
{
public:
    B() { cout << "B()" << endl; }
    ~B() { cout << "~B()" << endl; }
};

class Test : public A, public B // 派生列表
{
public:
    Test() { cout << "Test()" << endl; }
    ~Test() { cout << "~Test()" << endl; }

private:
    B ex1;
    A ex2;
};

int main()
{
    Test ex;
    return 0;
}
/*
运行结果：
A()
B()
B()
A()
Test()
~Test()
~A()
~B()
~B()
~A()
*/
ß
```

程序运行结果分析：

* 首先调用基类 `A` 和 `B` 的构造函数，按照派生列表 `public A`, `public B` 的顺序构造；
* 然后调用派生类 `Test` 的成员变量 `ex1` 和 `ex2` 的构造函数，按照派生类中成员变量声明的顺序构造；
* 最后调用派生类的构造函数；
* 接下来调用析构函数，和构造函数调用的顺序相反。

3. 类的成员初始化:
   类中可能含有静态变量和全局变量，由于静态变量和全局变量都被放在静态存储区，他们的初始化在 `main` 函数执行之前已被初始化，且 `static` 变量必须在类外进行初始化。

* 成员变量在使用初始化列表初始化时，与构造函数中初始化成员列表的顺序无关，只与定义成员变量的顺序有关。因为成员变量的初始化次序是根据变量在内存中次序有关，而内存中的排列顺序早在编译期就根据变量的定义次序决定了。
* 如果类不使用初始化列表初始化，而在类的构造函数内部进行初始化时，此时成员变量的初始化顺序与构造函数中代码逻辑有关。
* 类成员在定义时，是不能初始化的
* 类中 `const` 成员常量必须在构造函数初始化列表中初始化。
* 类中 `static` 成员变量，必须在类外初始化。

参考资料

* [C++成员变量的初始化顺序问题](https://leetcode.cn/link/?target=https://blog.csdn.net/zhaojinjia/article/details/8785912)

#### 15. 成员初始化列表效率高的原因 4

面试高频指数：★★★★☆

对象的成员函数数据类型可分为语言内置类型和用户自定义类，对于用户自定义类型，利用成员初始化列表效率高。用户自定义类型如果使用类初始化列表，直接调用该成员变量对应的构造函数即完成初始化；如果在构造函数中初始化，由于 `C++` 规定对象的成员变量的初始化动作发生在进入自身的构造函数本体之前，那么在执行构造函数之前首先调用默认的构造函数为成员变量设初值，在进入函数体之后，再显式调用该成员变量对应的构造函数。因此使用列表初始化会减少调用默认的构造函数的过程，效率更高一些。

```
#include <iostream>
using namespace std;
class A
{
private:
    int val;
public:
    A()
    {
        cout << "A()" << endl;
    }
    A(int tmp)
    {
        val = tmp;
        cout << "A(int " << val << ")" << endl;
    }
};

class Test1
{
private:
    A ex;

public:
    Test1() : ex(1) // 成员列表初始化方式
    {
    }
};

class Test2
{
private:
    A ex;

public:
    Test2() // 函数体中赋值的方式
    {
        ex = A(2);
    }
};
int main()
{
    Test1 ex1;
    cout << endl;
    Test2 ex2;
    return 0;
}
/*
运行结果：
A(int 1)

A()
A(int 2)
*/


```

* 说明：从程序运行结果可以看出，使用成员列表初始化的方式会省去调用默认的构造函数的过程。如果自定义的类型没有默认构造函数，此时必须使用初始化列表提供初值对这些类型进行初始化。

参考资料:

* [When do we use Initializer List in C++?](https://leetcode.cn/link/?target=https://www.***.org/when-do-we-use-initializer-list-in-c/)
* [Constructors and member initializer lists](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/language/constructor)
* [What are initializer lists in C++?](https://leetcode.cn/link/?target=https://www.educative.io/answers/what-are-initializer-lists-in-cpp)

#### 16. 友元函数的作用及使用场景 4

面试高频指数：★★★★☆

* 友元函数的作用：友元（`friend`）提供了不同类的成员函数之间、类的成员函数与一般函数之间进行数据共享的机制。通过友元，一个普通的函数或另一个类中的成员函数可以访问类中的私有成员和保护成员。

 **使用场景** ：

1. 普通函数定义为类的友元函数，使得普通函数能够访问该类的私有成员和保护成员。

```
#include <iostream>

using namespace std;

class A
{
    friend ostream &operator<<(ostream &_cout, const A &tmp); // 声明为类的友元函数

public:
    A(int tmp) : var(tmp)
    {
    }

private:
    int var;
};

ostream &operator<<(ostream &_cout, const A &tmp)
{
    _cout << tmp.var;
    return _cout;
}

int main()
{
    A ex(4);
    cout << ex << endl; // 4
    return 0;
}

```

2. 友元类：
   由于类的 `private` 和 `protected` 成员变量只能由类的成员函数访问或者派生类访问，友元类则提供提供一种通用的方法，使得不同类之间可以访问其 `private` 和 `protected` 成员变量，用于不同类之间共享数据。

```
#include <iostream>

using namespace std;

class A
{
    friend class B;

public:
    A() : var(10){}
    A(int tmp) : var(tmp) {}
    void fun()
    {
        cout << "fun():" << var << endl;
    }

private:
    int var;
};

class B
{
public:
    B() {}
    void fun()
    {
        cout << "fun():" << ex.var << endl; // 访问类 A 中的私有成员
    }

private:
    A ex;
};

int main()
{
    B ex;
    ex.fun(); // fun():10
    return 0;
}

```

参考资料:

* [Friend class and function in C++](https://leetcode.cn/link/?target=https://www.***.org/friend-class-function-cpp/)
* [Friendship and inheritance](https://leetcode.cn/link/?target=https://cplusplus.com/doc/tutorial/inheritance/)
* [C++ friend Function and friend Classes](https://leetcode.cn/link/?target=https://www.programiz.com/cpp-programming/friend-function-class)
* [Friend class](https://leetcode.cn/link/?target=https://en.wikipedia.org/wiki/Friend_class)
* [Friend function](https://leetcode.cn/link/?target=https://en.wikipedia.org/wiki/Friend_function)
* [Friend Functions and Friend Classes](https://leetcode.cn/link/?target=https://www.cprogramming.com/tutorial/friends.html)

#### 17. 静态绑定和动态绑定的实现 4

面试高频指数：★★★★☆

静态类型和动态类型：

* 静态类型：变量在声明时的类型，是在编译阶段确定的。静态类型不能更改。
* 动态类型：目前所指对象的类型，是在运行阶段确定的。动态类型可以更改。
  静态绑定和动态绑定：
* 静态绑定是指程序在**编译阶段**确定对象的类型（静态类型）。
* 动态绑定是指程序在**运行阶段**确定对象的类型（动态类型）。
  静态绑定和动态绑定的区别：
* 发生的时期不同：如上。
* 对象的静态类型不能更改，动态类型可以更改。
  注：对于类的成员函数，只有虚函数是动态绑定，其他都是静态绑定。

```
#include <iostream>

using namespace std;

class Base
{
public:
	virtual void fun() { cout << "Base::fun()" << endl;
     }
};
class Derive : public Base
{
public:
	void fun() { cout << "Derive::fun()"; 
    }
};


int main()
{
	Base *p = new Derive(); // p 的静态类型是 Base*，动态类型是 Derive*
    p->fun(); // fun 是虚函数，运行阶段进行动态绑定
	return 0;
}
/*
运行结果：
Derive::fun()
*/


```

* 动态绑定的实现原理：
  以下程序示例：

```
#include <iostream>
using namespace std;

class A{
private:
	int a1;
	int a2;
public:
	virtual void display(){ cout<<"A::display()"<<endl;}
	virtual void clone(){ cout<<"A::clone()"<<endl;}
};

class B: public A{
private:
    int b;
public:
    virtual void display(){ cout<<"B::display()"<<endl;} override
    virtual void init(){ cout<<"B::init()"<<endl;}
};

class C: public B{
private:
    int c;
public:
    virtual void display(){ cout<<"C::display()"<<endl;} override
    virtual void execute(){ cout<<"C::execute()"<<endl;} 
    virtual void init(){cout<<"C::init()"<<endl;} override
};

int main() {
    A *p1 = new B();
    A *p2 = new C();
    p1->display();
    p2->display();
    return 0;
}

```

我们对上述程序进行编译，并查看这里给出 `A`, `B`, `C` 三个类的虚函数表，如下图所示:

![4_24_1.png](https://pic.leetcode-cn.com/1661311210-yuOOTw-4_24_1.png)

可以得出以下结论：

* 类的内存占用由成员变量和指向虚函数表的指针组成，同时派生类的成员变量是会把基类的成员变量都继承的
* 同名虚函数在基类和派生类中的虚函数表中，在虚函数表中偏移位置是一致的，图 `A,B,C` 的 `display` 的偏移位置都为 `0`。同样名称的虚函数，在基类中定义的虚函数与派生类中定义的虚函数，在虚函数表中的偏移量都是一致的，只有这样才能保证动态绑定。
* 如果派生类中定义了与基类同名的虚函数，那么派生类的虚函数表中响应函数的入口地址会被替换成覆盖后的函数的地址。
* 一旦有新的虚函数定义，会加入到当前虚函数表的末端。
* 派生类的成员变量顺序也按照声明的顺序依次在内存中分配。

我们可以分以一下动态绑定的实现：

* 当我们用虚函数表指针去查找虚函数表中对应的函数的地址时，此时首先会找到函数地址的在虚函数表中的索引，这里 `display` 索引是 `0`。
* 然后编译器会做一个替换，`（*(p->vptr)[0]）`，找到 `p` 指针的函数入口地址。
* 程序运行后会执行这条语句 `*(p->vptr)[0]()`，完成函数的调用，实际即完成了动态绑定。

参考资料:

* [Virtual Function in C++](https://leetcode.cn/link/?target=https://www.***.org/virtual-function-cpp/?ref=gcse)
* [Polymorphism in C++](https://leetcode.cn/link/?target=https://www.***.org/polymorphism-in-c/)
* [C++ 虚函数表](https://leetcode.cn/link/?target=https://blog.csdn.net/nyist_zxp/article/details/80825031)

#### 18. 编译时多态和运行时多态的区别 4

面试高频指数：★★★★☆

* 编译时多态：在程序编译过程中出现，发生在模板和函数重载中（泛型编程）。实际在编译器内部看来不管是重载还是模板，编译器内部都会生成不同的函数，在代码段中分别装有两个函数的不同实现。
* 运行时多态：运行时多态也称动态绑定，在程序运行过程中出现，发生在继承体系中，是指通过基类的指针或引用访问派生类中的虚函数。

2. 编译时多态和运行时多态的区别：

* 时期不同：编译时多态发生在程序编译过程中，运行时多态发生在程序的运行过程中；
* 实现方式不同：编译时多态运用泛型编程来实现，运行时多态借助虚函数表来实现。

参考资料:

* [C++动态绑定原理](https://leetcode.cn/link/?target=https://blog.csdn.net/qq295109601/article/details/118981515)

#### 19. C++ 模板编程 3

面试高频指数：★★★☆☆

模板是 `C++` 编程语言的一个特性，它允许函数和类使用泛型类型进行操作。这允许一个函数或类在许多不同的数据类型上工作，而无需为每个类型重写。`C++` 模板是泛型编程的基础，泛型编程即以一种独立于任何特定类型的方式编写代码，`C++` 中使用 `template` 关键字。模板是创建泛型类或函数的蓝图或公式。库容器，比如迭代器和算法，都是泛型编程的例子，它们都使用了模板的概念。
共有三种模板：函数模板、类模板以及自 `C++ 14` 以来的变量模板:

1. 函数模板:
   函数模板的行为类似于函数，只是模板可以有许多不同类型的参数。一个函数模板代表一个函数族。使用类型参数声明函数模板的格式是：

```
template<class identifier> declaration;
template<typename identifier> declaration;

```

上述两种表达方式完全相同，引入后一种时为了防止混淆。比如 `C++` 标准库包含 `max(x, y)` 返回较大的 `x` 和的函数模板 `y` 。该函数模板可以这样定义:

```
template<typename T> T max(T &a, T &b) { return a > b ? a : b; }
std :: cout << max ( 3 , 7 ) << '\n' ;   
std :: cout << max ( 3.0 , 7.0 ) << '\n' ;   

```

这个单一的函数定义适用于许多数据类型。具体来说，它适用于定义了 `>`（大于运算符）的所有数据类型。除了限制对一个函数描述的更改并使代码更易于阅读之外，函数模板的使用减少了源代码的编写，与为特定程序中使用的所有不同数据类型编写单独的函数相比，模板不会产生更小的目标代码，实际编译器在编译时，会为根据不同的类型编译产生不同的函数。

2. 类模板：
   类模板提供了基于参数生成类的规范。类模板通常用于实现容器。类模板通过将一组给定的类型作为模板参数传递给它来实例化。`C++` 标准库包含许多类模板，特别是改编自标准模板库的容器，例如 `vector`，`list`。

```
template <class T>
class Stack { 
  private: 
    vector<T> elements;     // 元素 
 
  public: 
    void push(T const&);  // 入栈
    void pop();               // 出栈
    T top() const;            // 返回栈顶元素
    bool empty() const{       // 如果为空则返回真。
        return elements.empty(); 
    } 
}; 

```

3. 变量模板：
   在 `C++14` 以后，变量也可以参数化为特定的类型，这称为变量模板。

```
template<typename T> 
constexpr T pi = T{3.141592653589793238462643383L}; // (Almost) from std::numbers::pi

```

使用变量模板时，必须显式地指定它的类型：

```
std::cout << pi<double> << '\n';
std::cout << pi<float> << '\n';
```

4. 函数重载与模板的区别:
   函数重载和模板都是面向对象多态特性的例子。当多个函数执行非常相似（不相同）的操作时使用函数重载，当多个函数执行相同操作时使用模板。当模板类或者模板函数中含有静态变量时，则每个模板的实例类型都含有一个静态成员。

```
template <class T>
class A { 
  public: 
	static T val; 
}; 
A<int> a; // 含有静态成员 val;
A<string> b; // 含有静态成员 val;

```

参考资料：

* [Templates in C++ with Examples](https://leetcode.cn/link/?target=https://www.***.org/templates-cpp/)
* [C++ 模板](https://leetcode.cn/link/?target=https://www.runoob.com/cplusplus/cpp-templates.html)
* [Templates (C++)](https://leetcode.cn/link/?target=https://docs.microsoft.com/en-us/cpp/cpp/templates-cpp?view=msvc-170)
* [Template (C++)](https://leetcode.cn/link/?target=https://en.wikipedia.org/wiki/Template_(C%2B%2B))

#### 20. 如何避免拷贝 3

面试高频指数：★★★☆☆

最直观的想法是：将类的拷贝构造函数和赋值运算符重载声明为私有 `private`，但对于类的成员函数和友元函数依然可以调用，达不到完全禁止类的对象被拷贝的目的，而且程序会出现错误，因为未对函数进行定义。

1. 声明一个基类，具体做法如下。

* 定义一个基类，将其中的拷贝构造函数和赋值运算符重载声明为私有 `private`。
* 派生类以私有 `private` 的方式继承基类。

```
class Uncopyable
{
public:
    Uncopyable() {}
    ~Uncopyable() {}

private:
    Uncopyable(const Uncopyable &);            // 拷贝构造函数
    Uncopyable &operator=(const Uncopyable &); // 赋值运算符
};
class A : private Uncopyable // 注意继承方式
{ 
};

```

简单解释：

* 能够保证，在派生类 `A` 的成员函数和友元函数中无法进行拷贝操作，因为无法调用基类 `Uncopyable` 的拷贝构造函数或赋值运算符重载。同样，在类的外部也无法进行拷贝操作。

2. 拷贝构造函数 `=delete` 修饰:
   `C++ 11` 支持 `delete` 直接禁用类的成员函数调用。

```
class Uncopyable
{
public:
    Uncopyable() {}
    ~Uncopyable() {}
     Uncopyable(const Uncopyable &) = delete;            // 禁用拷贝构造函数
     Uncopyable &operator=(const Uncopyable &) = delete; // 禁用赋值运算符
};

```

参考资料：

* [C++禁止使用拷贝构造函数和赋值运算符方法](https://leetcode.cn/link/?target=https://blog.csdn.net/qq_45662588/article/details/121032975)
* [如何禁止自动生成拷贝构造函数？](https://leetcode.cn/link/?target=https://www.jianshu.com/p/1ba360949452)

#### 21. 为什么拷贝构造函数必须声明为引用 3

面试高频指数：★★★☆☆

1. 为什么拷贝函数必须为引用:
   原因：避免拷贝构造函数无限制的递归而导致栈溢出。

```
#include <iostream>
using namespace std;

class A
{
private:
    int val;

public:
    A(int tmp) : val(tmp) // 带参数构造函数
    {
        cout << "A(int tmp)" << endl;
    }

    A(const A &tmp) // 拷贝构造函数
    {
        cout << "A(const A &tmp)" << endl;
        val = tmp.val;
    }

    A &operator=(const A &tmp) // 赋值运算符重载
    {
        cout << "A &operator=(const A &tmp)" << endl;
        val = tmp.val;
        return *this;
    }

    void fun(A tmp)
    {
    }
};

int main()
{
    A ex1(1);
    A ex2(2);
    A ex3 = ex1;
    ex2 = ex1;
    ex2.fun(ex1);
    return 0;
}
/*
运行结果：
A(int tmp)
A(int tmp)
A(const A &tmp)
A &operator=(const A &tmp)
A(const A &tmp)
*/

```

* 说明 `1`：`ex2 = ex1;` 和 `A ex3 = ex1;` 为什么调用的函数不一样？
  对象 `ex2` 已经实例化了，不需要构造，此时只是将 `ex1` 赋值给 `ex2`，只会调用赋值运算符的重载；但是 `ex3` 还没有实例化，因此调用的是拷贝构造函数，构造出 `ex3`，而不是赋值函数，这里涉及到构造函数的隐式调用。
* 说明 2：如果拷贝构造函数中形参不是引用类型，`A ex3 = ex1;` 会出现什么问题？
  构造 `ex3`，实质上是 `ex3.A(ex1);`，假如拷贝构造函数参数不是引用类型，那么将使得 `ex3.A(ex1);` 相当于 `ex1` 作为函数 `A(const A tmp)` 的实参，在参数传递时相当于 `A tmp = ex1`，因为 `tmp` 没有被初始化，所以在 `A tmp = ex1` 中继续调用拷贝构造函数，接下来的是构造 `tmp`，也就是 `tmp.A(ex1)` ，必然又会有 `ex1` 作为函数 `A(const A tmp);` 的实参，在参数传递时相当于即 `A tmp = ex1`，那么又会触发拷贝构造函数，就这下永远的递归下去。
* 说明 3：为什么 `ex2.fun(ex1);` 会调用拷贝构造函数？
  `ex1` 作为参数传递给 `fun` 函数， 即 `A tmp = ex1;`，这个过程会调用拷贝构造函数进行初始化。

2. 什么情况下会调用拷贝构造函数：

* 直接初始化和拷贝初始化时

```
string dots("zhang"); //直接初始化
string dots = "zhang" //拷贝初始化
```

* 将一个对象作为实参传递给一个非引用或非指针类型的形参时
* 从一个返回类型为非引用或非指针的函数返回一个对象时
* 用花括号列表初始化一个数组的元素或者一个聚合类（很少使用）中的成员时。

3. 何时调用复制构造函数：
   新建一个对象并将其初始化为同类现有对象时，复制构造函数都将被调用。这在很多情况下都可能发生，最常见的情况是新对象显式地初始化为现有的对象。例如，假设 `motto` 是一个 `StringBad` 对象，则下面 `4` 种声明都将调用复制构造函数：

```
StringBad ditto(motto);
StringBad metoo = motto;
StringBad also = StringBad(motto);
StringBad * pStringBad = new StringBad(motto);

```

其中中间的 `2` 种声明可能会使用复制构造函数直接创建 `metoo` 和 `also` ，也可能使用复制构造函数生成一个临时对象，然后将临时对象的内容赋给 `metoo` 和 `also`，这取决于具体的实现。最后一种声明使用 `motto` 初始化一个匿名对象，并将新对象的地址赋给 `pStringBad` 指针。

参考资料：

* [拷贝构造函数在哪几种情况下会被调用](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/150367892?from_voters_page=true)
* [拷贝构造函数何时调用？](https://leetcode.cn/link/?target=https://www.zhihu.com/question/30726582)

#### 22. 如何禁止一个类被实例化

面试高频指数：★★★☆☆

1. 方法一：

* 在类中定义一个纯虚函数，使该类成为抽象基类，因为不能创建抽象基类的实例化对象；

```
#include <iostream>

using namespace std;


class A {
public:
    int var1, var2;
    A(){
        var1 = 10;
        var2 = 20;
    }
    virtual void fun() = 0; // 纯虚函数
};

int main()
{
    A ex1; // error: cannot declare variable 'ex1' to be of abstract type 'A'
    return 0;
}

```

2. 方法二：

* 将类的所有构造函数声明为私有 `private`；

3. 方法三：

* `C++ 11` 以后，将类的所有构造函数用 `=delete` 修饰；

#### 23. 实例化一个对象需要哪几个阶段 3

面试高频指数：★★★☆☆

* **分配空间**
  创建类对象首先要为该对象分配内存空间。不同的对象，为其分配空间的时机未必相同。全局对象、静态对象、分配在栈区域内的对象，在编译阶段进行内存分配；存储在堆空间的对象，是在运行阶段进行内存分配。
* **初始化**
  首先明确一点：初始化不同于赋值。初始化发生在赋值之前，初始化随对象的创建而进行，而赋值是在对象创建好后，为其赋上相应的值。这一点可以联想下上一个问题中提到：初始化列表先于构造函数体内的代码执行，初始化列表执行的是数据成员的初始化过程，这个可以从成员对象的构造函数被调用看的出来。
* **赋值**
  对象初始化完成后，可以对其进行赋值。对于一个类的对象，其成员变量的赋值过程发生在类的构造函数的函数体中。当执行完该函数体，也就意味着类对象的实例化过程完成了。（总结：构造函数实现了对象的初始化和赋值两个过程，对象的初始化是通过初始化列表来完成，而对象的赋值则才是通过构造函数的函数体来实现。）

注：对于拥有虚函数的类的对象，还需要给虚表指针赋值。

* 没有继承关系的类，分配完内存后，首先给虚表指针赋值，然后再列表初始化以及执行构造函数的函数体，即上述中的初始化和赋值操作。
* 有继承关系的类，分配内存之后，首先进行基类的构造过程，然后给该派生类的虚表指针赋值，最后再列表初始化以及执行构造函数的函数体，即上述中的初始化和赋值操作。

#### 24. 不允许修改类的成员变量的函数实现方法 3

面试高频指数：★★★☆☆

如果想达到一个类的成员函数不能修改类的成员变量，只需用 `const` 关键字来修饰该函数即可。该问题本质是考察 `const` 关键字修饰成员函数的作用，只不过以实例的方式来考察，面试者应熟练掌握 `const` 关键字的作用。同时 `C++` 还存在与 `const` 相反的关键字 `mutable`。被 `mutable` 修饰的变量，将永远处于可变的状态，即使在一个 `const` 函数中。如果我们需要在 `const` 函数中修改类的某些成员变量，这时就需要用到 `mutable`。
使用 `mutable` 的注意事项：

* `mutable` 只能作用于类的非静态和非常量数据成员。
* 在一个类中，应尽量避免大量使用 `mutable`，大量使用 `mutable` 表示程序设计存在缺陷。

```
#include <iostream>

using namespace std;

class A
{
public:
    mutable int var1;
    int var2;
    A()
    {
        var1 = 10;
        var2 = 20;
    }
    void fun() const // 不能在 const 修饰的成员函数中修改成员变量的值，除非该成员变量用 mutable 修饰
    {
        var1 = 100; // ok
        var2 = 200; // error: assignment of member 'A::var1' in read-only object
    }
};

int main()
{
    A ex1;
    return 0;
}

```

我们可以看到在 `const` 函数中， `mutable` 修饰的变量可以修改，否则则不能修改。

参考资料:

* [深入理解C++中的mutable关键字](https://leetcode.cn/link/?target=https://www.iteye.com/blog/shansun123-398582)

#### 25. 对象创建限制在堆或栈 2

面试高频指数：★★☆☆☆

`C++` 中的类的对象的建立分为两种：静态建立、动态建立。如何限制类的对象只能在堆上创建？如何限制对象只能在栈上创建？

* 静态建立：由编译器为对象在栈空间上分配内存，直接调用类的构造函数创建对象。例如：`A a`;
* 动态建立：使用 `new` 关键字在堆空间上创建对象，底层首先调用 `operator new()` 函数，在堆空间上寻找合适的内存并分配；然后，调用类的构造函数创建对象。例如：`A *p = new A()`;

1. 限制对象只能建立在堆上：
   最直观的思想：避免直接调用类的构造函数，因为对象静态建立时，会调用类的构造函数创建对象。但是直接将类的构造函数设为私有并不可行，因为当构造函数设置为私有后，不能在类的外部调用构造函数来构造对象，只能用 `new` 来建立对象。但是由于 `new` 创建对象时，底层也会调用类的构造函数，将构造函数设置为私有后，那就无法在类的外部使用 `new` 创建对象了。因此，这种方法不可行。

* 解决方法 1：
  将析构函数设置为私有。原因：静态对象建立在栈上，是由编译器分配和释放内存空间，编译器为对象分配内存空间时，会对类的非静态函数进行检查，即编译器会检查析构函数的访问性。当析构函数设为私有时，编译器创建的对象就无法通过访问析构函数来释放对象的内存空间，因此，编译器不会在栈上为对象分配内存。

```
class A
{
public:
    A() {}
    void destroy()
    {
        delete this;
    }

private:
    ~A()
    {
    }
};

```

该方法存在的问题：用 `new` 创建的对象，通常会使用 `delete` 释放该对象的内存空间，但此时类的外部无法调用析构函数，因此类内必须定义一个 `destroy()` 函数，用来释放 `new` 创建的对象。无法解决继承问题，因为如果这个类作为基类，析构函数要设置成 `virtual`，然后在派生类中重写该函数，来实现多态。但此时，析构函数是私有的，派生类中无法访问。

* 解决方法 2：
  构造函数设置为 `protected`，并提供一个 `public` 的静态函数来完成构造，而不是在类的外部使用 `new` 构造；将析构函数设置为 `protected`。原因：类似于单例模式，也保证了在派生类中能够访问析构函数。通过调用 `create()` 函数在堆上创建对象。

```
class A
{
protected:
    A() {}
    ~A() {}

public:
    static A *create()
    {
        return new A();
    }
    void destroy()
    {
        delete this;
    }
};

```

2. 限制对象只能建立在栈上：

* 解决方法：将 `operator new()` 设置为私有。原因：当对象建立在堆上时，是采用 `new` 的方式进行建立，其底层会调用 `operator new()` 函数，因此只要对该函数加以限制，就能够防止对象建立在堆上。

```
class A
{
private:
    void *operator new(size_t t) {}    // 注意函数的第一个参数和返回值都是固定的
    void operator delete(void *ptr) {} // 重载了 new 就需要重载 delete
public:
    A() {}
    ~A() {}
};

```

#### 26. 空类字节数及对应生成的成员函数

面试高频指数：★★☆☆☆

1. 空类声明时编译器不会生成任何成员函数：
   对于空类，声明编译器不会生成任何的成员函数，只会生成 `1` 个字节的占位符。由于在实际程序中，空类同样可以被实例化，而每个实例在内存中都有一个独一无二的地址，为了达到这个目的，编译器往往会给一个空类隐含的加一个字节，这样空类在实例化后在内存得到了独一无二的地址，所以 `sizeof(A)` 的大小为 `1`。

```
#include <iostream>
using namespace std;

class A
{
};

int main()
{
    A a;
    cout << "sizeof(A):" << sizeof(a) << endl; // sizeof(A):1
    return 0;
}

```

2. 空类定义时编译器会生成 6 个成员函数：
   当空类 `A` 定义对象时，`sizeof(A)` 仍是为 `1`，但编译器会在需要时生成 `6` 个成员函数：缺省的构造函数、拷贝构造函数、析构函数、赋值运算符、两个取址运算符。

```
#include <iostream>
using namespace std;
/*
class A
{}; 该空类的等价写法如下：
*/
class A
{
public:
    A(){};                                       // 缺省构造函数
    A(const A &tmp){};                           // 拷贝构造函数
    ~A(){};                                      // 析构函数
    A &operator=(const A &tmp){};                // 赋值运算符
    A *operator&() { return this; };             // 取址运算符
    const A *operator&() const { return this; }; // 取址运算符（const 版本）
};

int main()
{
    A *p = new A(); 
    cout << "sizeof(A):" << sizeof(A) << endl; // sizeof(A):1
    delete p;   
    return 0;
}

```

参考资料：

* [C++中空类详解](https://leetcode.cn/link/?target=https://blog.csdn.net/zhouyiqiu1990/article/details/123846356)

#### 27. 类的大小

面试高频指数：★★☆☆☆

1. 类大小的计算:
   说明：类的大小是指类的实例化对象的大小，用 `sizeof` 对类型名操作时，结果是该类型的对象的大小。计算原则如下：

* 遵循结构体的成员变量对齐原则。
* 与普通成员变量有关，与成员函数和静态成员无关。即普通成员函数，静态成员函数，静态数据成员，静态常量数据成员均对类的大小无影响。因为静态数据成员被类的对象共享，并不属于哪个具体的对象。
* 虚函数对类的大小有影响，是因为虚函数表指针的影响。
* 虚继承对类的大小有影响，是因为虚基表指针带来的影响。
* 空类的大小是一个特殊情况，空类的大小为 `1`，空类同样可以被实例化，而每个实例在内存中都有一个独一无二的地址，为了达到这个目的，编译器往往会给一个空类隐含的加一个字节，这样空类在实例化后在内存得到了独一无二的地址，所以 `sizeof(A)` 的大小为 `1`。

2. 简单情况和空类情况:

```
/*
说明：程序是在 64 位编译器下测试的
*/
#include <iostream>

using namespace std;

class A
{
private:
    static int s_var; // 不影响类的大小
    const int c_var;  // 4 字节
    int var;          // 8 字节 4 + 4 (int) = 8
    char var1;        // 12 字节 8 + 1 (char) + 3 (填充) = 12
public:
    A(int temp) : c_var(temp) {} // 不影响类的大小
    ~A() {}                    // 不影响类的大小
};

class B
{
};
int main()
{
    A ex1(4);
    B ex2;
    cout << sizeof(ex1) << endl; // 12 字节
    cout << sizeof(ex2) << endl; // 1 字节
    return 0;
}

```

3. 带有虚函数的情况：
   注意：虚函数的个数并不影响所占内存的大小，因为类对象的内存中只保存了指向虚函数表的指针。由于不同平台、不同编译器厂商所生成的虚表指针在内存中的布局是不同的，有些将虚表指针置于对象内存中的开头处，有些则置于结尾处。在 `X64 GCC` 编译器下，虚指针在类的开头出，我们可以通过偏移量获取。
   程序示例，我们通过对象内存的开头处取出 `vptr`，并遍历对象虚函数表。

```
/*
说明：程序是在 64 位编译器下测试的
*/
#include <iostream>

using namespace std;

class A
{
private:
    static int s_var; // 不影响类的大小
    const int c_var;  // 4 字节
    int var;          // 8 字节 4 + 4 (int) = 8
    char var1;        // 12 字节 8 + 1 (char) + 3 (填充) = 12
public:
    A(int temp) : c_var(temp) {} // 不影响类的大小
    ~A() {}                      // 不影响类的大小
    virtual void f() { cout << "A::f" << endl; }

    virtual void g() { cout << "A::g" << endl; }

    virtual void h() { cout << "A::h" << endl; } // 24 字节 12 + 4 (填充) + 8 (指向虚函数的指针) = 24
};

typedef void (*func)(void);

void printVtable(unsigned long *vptr, int offset) {
	func fn = (func)*((unsigned long*)(*vptr) + offset);
	fn();
}

int main()
{
    A ex1(4);
    A *p;
    cout << sizeof(p) << endl;   // 8 字节 注意：指针所占的空间和指针指向的数据类型无关
    cout << sizeof(ex1) << endl; // 24 字节
    unsigned long* vPtr = (unsigned long*)(&ex1);
    printVtable(vPtr, 0);
	printVtable(vPtr, 1);
	printVtable(vPtr, 2);
    return 0;
}
/*
8
24
A::f
A::g
A::h
*/

```

4. 含有虚继承的情况：

不包含虚继承的情况，派生类直接继承了基类的成员变量，内存分布如下:

![4_17_1.png](https://pic.leetcode-cn.com/1661311121-oxqPRC-4_17_1.png)


```
#include <iostream>
using namespace std;

class A
{
public:
     int a;
};

class B : public A
{
public:
    int b;
    void bPrintf() {
    std::cout << "This is class B" << "\n";
    }
};

int main(){
    A a;
    B b;
    cout<<sizeof(a)<<endl;
    cout<<sizeof(b)<<endl;
    return 0;
}
/*
4
8
*/

```

* 如果加入虚继承，此时对象中多了一个指向虚基类表的指针，对象 `B` 与对象 `C` 均多了一个指针变量 `vbptr`。

```
#include <iostream>
using namespace std; // 采用 4 字节对齐

#pragma pack(4)
class A
{
public:
     int a;
};

class B : virtual public A
{
public:
    int b;
    void bPrintf() {
    std::cout << "This is class B" << "\n";}
};

class C : virtual public A
{
public:
    int c;
    void cPrintf() {
    std::cout << "This is class C" << "\n";}
};

class D : public B, public C
{
public:
    int d;
    void dPrintf() {
    std::cout << "This is class D" << "\n";}
};

int main(){
    A a;
    B b;
    C c;
    D d;
    cout<<sizeof(a)<<endl;
    cout<<sizeof(b)<<endl;
    cout<<sizeof(c)<<endl;
    cout<<sizeof(d)<<endl;
    return 0;
}
/*
4
16
16
32
*/

```

我们可以看到:
实际的内存布局如下:

![4_17_2.png](https://pic.leetcode-cn.com/1661311144-AqbyVt-4_17_2.png)

虚基类表的填充内容如下:

* 第一项表示派生类对象指针相对于虚基类表指针 `vbptr` 的偏移，在图中我们可以看到在 `B` 中，`B` 的起始地址相对于 `vptr` 的偏移量为 `12`；
* 从第二项开始表示各个基类的地址相对于虚基类表指针 `vbptr` 的偏移，在图中我们可以看到在 `B` 中，`A` 的起始地址相对于 `vptr` 的偏移量为 `12`；
  虚继承的情况就比较复杂，虚继承需要额外加上一个指向虚基类表的指针。虚继承的基础上如果再加上虚函数，还需要额外加上虚函数表的指针占用的空间。

参考资料：

* [C++ 虚继承实现原理（虚基类表指针与虚基类表）](https://leetcode.cn/link/?target=https://www.cnblogs.com/zhjblogs/p/14274188.html)
* [虚继承中，虚基类在派生类中的内存分布是如何？](https://leetcode.cn/link/?target=https://www.zhihu.com/question/24858417?sort=created)
* [【c++内存分布系列】虚基类表](https://leetcode.cn/link/?target=https://www.cnblogs.com/budapeng/p/3305790.html)


#### 28. 如何让类不能被继承 2

面试高频指数：★★☆☆☆

* 使用 `final` 关键字:
  使用 `final` 关键字修饰的类不能被继承。

C++

---

```
#include <iostream>

using namespace std;

class Base final
{
};

class Derive: public Base{ // error: cannot derive from 'final' base 'Base' in derived type 'Derive'

};

int main()
{
    Derive ex;
    return 0;
}
```


* 使用友元、虚继承和私有构造函数来实现

```
#include <iostream>
using namespace std;

template <typename T>
class Base{
    friend T;
private:
    Base(){
        cout << "base" << endl;
    }
    ~Base(){}
};

class B:virtual public Base<B>{   //一定注意 必须是虚继承
public:
    B(){
        cout << "B" << endl;
    }
};

class C:public B{
public:
    C(){}     // error: 'Base<T>::Base() [with T = B]' is private within this context
};


int main(){
    B b;  
    return 0;
}

```

说明：在上述代码中 `B` 类是不能被继承的类。
具体原因：

* 虽然 `Base` 类构造函数和析构函数被声明为私有 `private`，在 `B` 类中，由于 `B` 是 `Base` 的友元，因此可以访问 `Base` 类构造函数，从而正常创建 `B` 类的对象；
* `B` 类继承 `Base` 类采用虚继承的方式，创建 `C` 类的对象时，`C` 类的构造函数要负责 `Base` 类的构造，但是 `Base` 类的构造函数私有化了，`C` 类没有权限访问。因此，无法创建 `C` 类的对象， `B` 类是不能被继承的类。
* 注意：在继承体系中，友元关系不能被继承，虽然 `C` 类继承了 `B` 类，`B` 类是 `Base` 类的友元，但是 `C` 类和 `Base` 类没有友元关系。
