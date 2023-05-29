### 5, C++ 语言特性相关

本章将重点涉及以下高频知识点：

1. [左值和右值：区别、引用及转化](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vd00s1/)
2. [std::move() 函数的实现原理](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vd7vz7/)
3. [指针及其大小、用法](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdlag5/)
4. [指针和引用的区别](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdth8c/)
5. [常量指针和指针常量的区别](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdtbti/)
6. [函数指针的定义](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vd81ue/)
7. [参数传递中：值传递、引用传递、指针传递的区别](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vd68dj/)
8. [迭代器的作用](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vd19r3/)
9. [野指针和悬空指针详解](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdir66/)
10. [强制类型转换的类型](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vd3zlg/)
11. [什么是类型萃取](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdyb91/)
12. [C++ 11 nullptr 比 NULL 的优势比较](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdu9q2/)
13. [结构体相等的判断方式及 memcmp 函数的使用](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdq67v/)
14. [模板及其实现](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdkiwt/)[函数模板和类模板的区别](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdg0vr/)
15. [什么是模板特化](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdsaad/)
16. [泛型编程如何实现](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdyhom/)
17. [switch 的 case 里为何不建议定义变量](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vd4rmh/)
18. [什么是可变参数模板](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdzv2s/)


#### 01. 左值和右值：区别、引用及转化 5

面试高频指数：★★★★★

1. 左值与右值:

* 左值：指表达式结束后依然存在的持久对象。可以取地址，可以通过内置（不包含重载） `&` 来获取地址，我们可以将一个右值赋给左值。
* 右值：表达式结束就不再存在的临时对象。不可取地址，不可以通过内置（不包含重载） `&` 来获取地址。由于右值不可取地址，因此我们不能将任何值赋给右值。
* 使用 `=` 进行赋值时，`=` 的左边必须为左值，右值只能出现在 `=` 的右边。
  程序示例:

> ```
> // x 是左值，666 为右值
> int x = 666;   // ok 
> int *y = x; // ok
> int *z = &666 // error
> 666 = x; // error
> int a = 9; // a 为左值
> int b = 4; // b 为左值
> int c = a + b // c 为左值 , a + b 为右值
> a + b = 42; // error
>
> ```

* 函数返回值即可以是左值，也可以是右值:

```
int setValue()
{
    return 6;
}

int global = 100;

int& setGlobal()
{
    return global;  
}
setValue() = 3; // error!
setGlobal() = 400; // OK

```

2. 左值引用和右值引用：
   引用的定义在之前的章节中已经介绍过。

* 左值引用：

  * 左值引用可以区分为常量左值引用和非常量左值引用。左值引用的底层实现是指针实现。
  * 非常量左值引用只能绑定到非常量左值，不能绑定到常量左值和右值。如果绑定到非常量右值，就有可能指向一个已经被销毁的对象。
  * 常量左值引用能绑定到非常量左值，常量左值和右值；

  ```
  int y = 10;
  int& yref = y;  // ok
  int& xref = 10; // error， 非常量左值引用绑定右值
  const &xref = 10; // ok, 常量左值引用绑定右值
  int a = 10;
  int b = 20;
  int& zref = a + b // error， a + b为右值


  int &aref1 = a;  //ok, 非常量左值引用绑定非常量左值
  const int &aRef2 = a; //ok, 常量左值引用绑定非常量左值
  const int c = 4;   
  int &cref1 = c;  // error，非常量左值不能绑定常量右值
  const int &cref2 = c; //ok, 常量左值引用绑定常量左值
  const int &ref2 = a + b;    //ok, 常量左值引用绑定到右值（表达式）

  ```

我们来观察一下函数运行:

* 如果函数的形参定义为非常量的左值引用，则会出现错误，因为此时我们将一个左值引用绑定到右值上：

```
void fnc(int& x)
{
}
int main()
{
    fnc(10);  // error!
}
```

- 如果函数的形参定义为常量的左值引用，则可以正常运行，因为此时我们将一个常量左值引用绑定到一个右值上

```
void fnc(const int& x)
{
}
int main()
{
    int x = 10;
    fnc(x);   // ok!
    fnc(10);  // ok!
}

```

* 右值引用：
  右值引用 （`Rvalue Referene`） 是 `C++ 11` 中引入的新特性 , 它实现了转移语义 （`Move Sementics`）和精确传递 （`Perfect Forwarding`），`&&` 作为右值引用的声明符。右值引用必须绑定到右值的引用，通过 `&&` 获得。右值引用只能绑定到一个将要销毁的对象上，因此可以自由地移动其资源。
  从实践角度讲，它能够完美解决 `C++` 中长久以来为人所诟病的临时对象效率问题。从语言本身讲，它健全了 `C++` 中的引用类型在左值右值方面的缺陷。从库设计者的角度讲，它给库设计者又带来了一把利器。从使用者的角度来看，可以获得效率的提升，避免对象在传递过程中重复创建。

右值引用两个主要功能：

* 消除两个对象交互时不必要的对象拷贝，节省运算存储资源，提高效率。
* 能够更简洁明确地定义泛型函数。

```
#include <iostream>
using namespace std;

int g_val = 10;

void ProcessValue(int &i) {                         // 左值引用
    cout << "lValue processed: " << i << endl;
}

void ProcessValue(int &&i) {                        // 右值引用
    cout << "rValue processed: " << i << endl;
}

int GetValue() { // 返回右值
    return 3; 
} 

int& getVal() { // 返回左值引用
    return g_val; 
}

int main() {
    int a = 0;
    int b = 1;
    int &alRef = a;             // 左值引用
    int &&rRef1 = 1;            // 临时对象是右值
    int &&rRef2 = GetValue();   // 调用的函数为右值
    ProcessValue(a);            // 左值
    ProcessValue(getVal());     // 左值引用
    ProcessValue(1);            // 临时对象是右值
    ProcessValue(GetValue());   // 调用的函数为右值
    ProcessValue(a+b);          // 表达式为右值
    return 0;
}
/*
lValue processed: 0
lValue processed: 10
rValue processed: 1
rValue processed: 3
rValue processed: 1
*/

```


有了右值引用后，函数调用可以写为如下，此时我们用右值引用绑定到右值上：

```
void fnc(int&& x)
{

}

int main()
{
    int x = 10;
    fnc(x);   // error, 右值引用不能绑定到左值上
    fnc(10);  // ok!
}

```

3. 左值转换成右值:

* 左值转换为右值
  我们可以通过 `std::move` 可以将一个左值强制转化为右值，继而可以通过右值引用使用该值，以用于移动语义，从而完成将资源的所有权进行转移。

```
#include <iostream>
using namespace std;

void fun(int& tmp) 
{ 
  cout << "fun lvalue bind:" << tmp << endl; 
} 

void fun(int&& tmp) 
{ 
  cout << "fun rvalue bind:" << tmp << endl; 
} 

void fun1(int& tmp) 
{ 
  cout << "fun1 lvalue bind:" << tmp << endl; 
} 

int main() 
{ 
    int var = 11; 
    fun(12); // 右值引用
    fun(var); // 左值引用
    fun(std::move(var)); // 使用std::move转为右值引用
    fun(static_cast<int&&>(var));  // 使用static_cast转为右值引用
    fun((int&&)var); // 使用C风格强转为右值引用
    fun(std::forward<int&&>(var)); // 使用std::forwad<T&&>为右值引用
    fun1(12); // error
    return 0;
}
/*
fun rvalue bind:12
fun lvalue bind:11
fun rvalue bind:11
fun rvalue bind:11
fun rvalue bind:11
fun rvalue bind:11
*/

```

4. 引用折叠:
   通过类型别名或者通过模板参数间接定义，多重引用最终折叠成左值引用或者右值引用。有两种引用（左值和右值），所以就有四种可能的引用+引用的组合（左值 `+` 左值，左值 `+` 右值，右值 `+` 左值，右值 `+` 右值）。如果引用的引用出现在允许的语境，该双重引用会折叠成单个引用，规则如下：

* 所有的右值引用叠加到右值引用上仍然还是一个右值引用；`T&& &&` 折叠成 `T&&`
* 所有的其他引用类型之间的叠加都将变成左值引用。`T& &&,T&& &, T&&` 折叠成 `T&`。

```
#include <iostream>
using namespace std;

typedef int&  lref;
typedef int&& rref;

void fun(int&& tmp) 
{ 
    cout << "fun rvalue bind:" << tmp << endl; 
} 

void fun(int& tmp) 
{ 
    cout << "fun lvalue bind:" << tmp << endl; 
} 

int main() 
{ 
    int n = 11; 
    fun((lref&)n);
    fun((lref&&)n);
    fun((rref&)n);
    fun((rref&&)n);
    return 0;
}
/*
fun lvalue bind:11
fun lvalue bind:11
fun lvalue bind:11
fun rvalue bind:11
*/

```

5. 万能引用类型:
   在模板中 `T&& t` 在发生自动类型推断的时候，它是未定的引用类型（`universal references`），它既可以接受一个左值又可以接受一个右值。如果被一个左值初始化，它就是一个左值；如果它被一个右值初始化，它就是一个右值，它是左值还是右值取决于它的初始化。

示例代码如下:

```
template<typename T>
void f(T&& param); 

template<typename T>
class Test {
    Test(Test&& rhs); 
};

```

对于函数 `template<typename T>void f(T&& t)`，当参数为右值 `10` 的时候，根据 `universal references` 的特点，`t` 被一个右值初始化，那么 `t` 就是右值；当参数为左值 `x` 时，`t` 被一个左值引用初始化，那么 `t` 就是一个左值。
上面的例子中，`param` 是 `universal reference`，`rhs` 是 `Test&&` 右值引用，因为模版函数 `f` 发生了类型推断，而 `Test&&` 并没有发生类型推导，因为 `Test&&` 是确定的类型了。正是因为右值引用可能是左值也可能是右值，依赖于初始化，我们可以利用这一点来实现移动语义和完美转发。

参考资料：

* [从4行代码看右值引用](https://leetcode.cn/link/?target=https://www.cnblogs.com/qicosmos/p/4283455.html)
* [谈谈C++的左值右值，左右引用，移动语意及完美转发](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/402251966)
* [c++引用折叠](https://leetcode.cn/link/?target=https://blog.csdn.net/kupepoem/article/details/119944958)
* [Reference declaration](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/language/reference)
* [引用折叠和完美转发](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/50816420)
* [Lvalues and Rvalues (C++)](https://leetcode.cn/link/?target=https://docs.microsoft.com/en-us/cpp/cpp/lvalues-and-rvalues-visual-cpp?view=msvc-170)
* [Reference declaration](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/language/reference)
* [Understanding lvalues and rvalues in C and C++](https://leetcode.cn/link/?target=https://eli.thegreenplace.net/2011/12/15/understanding-lvalues-and-rvalues-in-c-and-c#id1)
* [C++ Rvalue References Explained](https://leetcode.cn/link/?target=http://thbecker.net/articles/rvalue_references/section_01.html)
* [Understanding the meaning of lvalues and rvalues in C++](https://leetcode.cn/link/?target=https://www.internalpointers.com/post/understanding-meaning-lvalues-and-rvalues-c)
* [“New” Value Terminology](https://leetcode.cn/link/?target=https://www.stroustrup.com/terminology.pdf)

[](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vvt83m/)
