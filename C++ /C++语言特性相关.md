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

#### 02. std::move() 函数的实现原理 5

面试高频指数：★★★★★

1. `std::move()` 函数原型：
   `move` 函数是将任意类型的左值转为其类型的右值引用。

```
template <typename T>
typename remove_reference<T>::type&& move(T&& t)
{
	return static_cast<typename remove_reference<T>::type &&>(t);
}

```

首先需要了解一下，引用折叠原理:

* 右值传递给上述函数的形参 `T&&` 依然是右值，即 `T&& &&` 相当于 `T&&`。
* 左值传递给上述函数的形参 `T&&` 依然是左值，即 `T&& &` 相当于 `T&`。
  我们已经知道折叠原理，通过引用折叠原理可以知道，`move()` 函数的形参既可以是左值也可以是右值。

再次详细描述 `move` 函数的处理流程:

* 首先利用万能模板将传入的参数 `t` 进行处理，我们知道右值经过 `T&&` 传递类型保持不变还是右值，而左值经过 `T&&` 变为普通的左值引用，以保证模板可以传递任意实参，且保持类型不变；对参数 `t` 做一次右值引用，根据引用折叠规则，右值的右值引用是右值引用，而左值的右值引用是普通的左值引用。万能模板既可以接受左值作为实参也可以接受右值作为实参。
* 通过 `remove_refrence` 移除引用，得到参数 `t` 具体的类型 `type`；
* 最后通过 `static_cast<>` 进行强制类型转换，返回 `type &&` 右值引用。

2. `remove_reference` 具体实现：
   `remove_reference` 主要作用是解除类型中引用并返回变量的实际类型。

```
//原始的，最通用的版本
template <typename T> struct remove_reference{
    typedef T type;  //定义 T 的类型别名为 type
};
 
//部分版本特例化，将用于左值引用和右值引用
template <class T> struct remove_reference<T&> //左值引用
{ typedef T type; }
 
template <class T> struct remove_reference<T&&> //右值引用
{ typedef T type; }   
  
//举例如下,下列定义的a、b、c三个变量都是int类型
int i;
remove_refrence<decltype(42)>::type a;             //使用原版本，
remove_refrence<decltype(i)>::type  b;             //左值引用特例版本
remove_refrence<decltype(std::move(i))>::type  b;  //右值引用特例版本 

```

3. `forward` 的实现：
   `forward` 保证了在转发时左值右值特性不会被更改，实现完美转发。主要解决引用函数参数为右值时，传进来之后有了变量名就变成了左值。比如如下代码:

```
#include <iostream>
using namespace std;

template<typename T>
void fun(T&& tmp) 
{ 
    cout << "fun rvalue bind:" << tmp << endl; 
} 

template<typename T>
void fun(T& tmp) 
{ 
    cout << "fun lvalue bind:" << tmp << endl; 
} 

template<typename T>
void test(T&& x) {
    fun(x);
    fun(std::forward<T>(x));
}

int main() 
{ 
    int a = 10;
    test(10);
    test(a);
    return 0;
}
/*
fun lvalue bind:10
fun rvalue bind:10
fun lvalue bind:10
fun lvalue bind:10
*/


```

参数 `x` 为右值，到了函数内部则变量名则变为了左值，我们使用 `forward` 即可保留参数 `x` 的属性。
`forward` 函数实现如下:

```
  /**
   *  @brief  Forward an lvalue.
   *  @return The parameter cast to the specified type.
   *
   *  This function is used to implement "perfect forwarding".
   */
template<typename _Tp>
constexpr _Tp&&
forward(typename std::remove_reference<_Tp>::type& __t) noexcept
{ return static_cast<_Tp&&>(__t); }

/**
 *  @brief  Forward an rvalue.
 *  @return The parameter cast to the specified type.
 *
 *  This function is used to implement "perfect forwarding".
 */
template<typename _Tp>
constexpr _Tp&&
forward(typename std::remove_reference<_Tp>::type&& __t) noexcept
{
    static_assert(!std::is_lvalue_reference<_Tp>::value, "template argument"
        " substituting _Tp is an lvalue reference type");
    return static_cast<_Tp&&>(__t);
}

```

`forward` 函数的处理流程:

* `forward` 同样利用引用折叠的特性，对参数 `t` 做一次右值引用，根据引用折叠规则，右值的右值引用是右值引用，而左值的右值引用是普通的左值引用。`forward` 的实现有两个函数：
  第一个，接受的参数是左值引用，只能接受左值。
  第二个，接受的参数是右值引用，只能接受右值。
  根据引用折叠的原理：
  * 如果传递的是左值，`_Tp` 推断为 `T &`，则返回变成 `static_cast<T& &&>`，也就是 `static_cast<T&>`，所以返回的是左值引用。
  * 如果传递的是右值，`_Tp` 推断为 `T&&` 或者 `T`，则返回变成 `static_cast<T && &&>`，所以返回的是右值引用。
* `forward` 与 `move` 最大的区别是，`move` 在进行类型转换时，利用 `remove_reference` 将外层的引用全部去掉，这样可以将 `t` 强制转换为指定类型的右值引用，而 `forward` 则利用引用折叠的技巧，巧妙的保留了变量原有的属性。
  以下示例代码就可以观察到 `move` 与 `forward` 的原理区别:

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
    int a = 11; 
	int &b = a;
	int &&c = 100;
	fun(static_cast<lref &&>(b));
	fun(static_cast<rref &&>(c));
	fun(static_cast<int &&>(a));
	fun(static_cast<int &&>(b));
	fun(static_cast<int &&>(c));
    return 0;
}
/*
fun lvalue bind:11
fun rvalue bind:100
fun rvalue bind:11
fun rvalue bind:11
fun rvalue bind:100
*/


```

参考资料：

* [谈谈C++的左值右值，左右引用，移动语意及完美转发](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/402251966)
* [c++引用折叠](https://leetcode.cn/link/?target=https://blog.csdn.net/kupepoem/article/details/119944958)
* [引用折叠和完美转发](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/50816420)
* [条款23.理解move和forward](https://leetcode.cn/link/?target=https://blog.csdn.net/qq_36553387/article/details/116885439)

#### 03. 指针及其大小、用法 5

面试高频指数：★★★★★

1. 指针的定义:
   指针是一种变量类型，其值为另一个变量的地址，即内存位置的直接地址。就像其他变量或常量一样，必须在使用指针存储其他变量地址之前，对其进行声明。在 `64` 位计算机中，指针占 `8` 个字节空间。使用指针时可以用以下几个操作：定义一个指针变量、把变量地址赋值给指针、访问指针变量中可用地址的值。通过使用一元运算符 `*` 来返回位于操作数所指定地址的变量的值。

```
#include<iostream>

using namespace std;

int main(){
    int *p = nullptr;
    cout << sizeof(p) << endl; // 8

    char *p1 = nullptr;
    cout << sizeof(p1) << endl; // 8
    return 0;
}


```

2. 指针的用法：

* 空指针:
  `C` 语言中定义了空指针为 `NULL`，实际是一个宏，它的值是 `0`，即 `#define NULL 0`。`C++` 中使用 `nullptr` 表示空指针，它是 `C++ 11` 中的关键字，是一种特殊类型的字面值，可以被转换成任意其他类型。
* 指针的运算:
  * 两个同类型指针可以比较大小；
  * 两个同类型指针可以相减；
  * 指针变量可以和整数类型变量或常量相加；
  * 指针变量可以减去一个整数类型变量或常量；
  * 指针变量可以自增，自减；

```
int a[10];
int *p1 = a + 1; // 指针常量相加
int *p2 = a + 4;
bool greater = p2 > p1; // 比较大小
int offset = p2 - a; // 相减
p2++; // 自增
p1--; // 自减


```

* 指向普通对象的指针:

```
#include <iostream>

using namespace std;

class A
{
};

int main()
{
    A *p = new A();
    return 0;
}

```

* 指向常量对象的指针：常量指针，`const` 修饰表示指针指向的内容不能更改。

  ```
  #include <iostream>
  using namespace std;

  int main(void)
  {
      const int c_var = 10;
      const int * p = &c_var;
      cout << *p << endl;
      return 0;
  }

  ```
* 指向函数的指针：函数指针。

```
#include <iostream>
using namespace std;

int add(int a, int b){
    return a + b;
}

typedef int (*fun_p)(int, int);

int main(void)
{
    fun_p fn = add;
    cout << fn(1, 6) << endl;
    return 0;
}

```

* 指向对象成员的指针，包括指向对象成员函数的指针和指向对象成员变量的指针。
  特别注意：定义指向成员函数的指针时，要标明指针所属的类。

```
#include <iostream>

using namespace std;

class A
{
public:
    int var1, var2; 
	static int x;
	static int get() {
		return 100;
	}

    int add(){
        return var1 + var2;
    }
};



int main()
{
    A ex;
    ex.var1 = 3;
    ex.var2 = 4;
    int *p = &ex.var1; // 指向对象成员变量的指针
    cout << *p << endl;

    int (A::*fun_p)();
	int (*fun_q)();
    fun_p = &A::add; // 指向对象非静态成员函数的指针 fun_p
	fun_q = A::get; // 指向对象静态成员函数的指针 fun_q
	cout << (ex.*fun_p)() << endl;
    cout << (*fun_q)() << endl;
    return 0;
}


```

而对于函数类型到函数指针类型的默认转换，只有当函数类型是左值的时候才行。所有对于非静态的成员函数，就不存在这种从函数类型到函数指针类型的默认转换，于是编译器也就不知道这个 `p = A::add` 该怎么确定。

* 由于非静态成员函数指针可以有多态行为，在编译期函数地址可能无法确定。
* 静态成员函数指针在编译期函数地址则可以确定。
* `this` 指针：指向类的当前对象的指针常量。

```
#include <iostream>
#include <cstring>
using namespace std;

class A
{
public:
    void set_name(string tmp)
    {
        this->name = tmp;
    }
    void set_age(int tmp)
    {
        this->age = age;
    }
    void set_sex(int tmp)
    {
        this->sex = tmp;
    }
    void show()
    {
        cout << "Name: " << this->name << endl;
        cout << "Age: " << this->age << endl;
        cout << "Sex: " << this->sex << endl;
    }

private:
    string name;
    int age;
    int sex;
};

int main()
{
    A *p = new A();
    p->set_name("Alice");
    p->set_age(16);
    p->set_sex(1);
    p->show();

    return 0;
}

```

参考资料：

* [C++ 指针](https://leetcode.cn/link/?target=https://www.runoob.com/cplusplus/cpp-pointers.html)
* [c++指针运算](https://leetcode.cn/link/?target=https://blog.csdn.net/maxzcl/article/details/117821601)

#### 04. 指针和引用的区别 5

面试高频指数：★★★★★

* 指针：指针是一个变量，它保存另一个变量的内存地址。需要使用 `*` 运算符指针才能访问它指向的内存位置。
* 引用：引用变量是别名，即已存在变量的另一个名称。对于编译器来说，引用和指针一样，也是通过存储对象的地址来实现的。实际可以将引用视为具有自动间接寻址的常量指针，编译器自动为引用使用 `*` 运算符。

1. 二者的区别

* 是否可变:
  指针所指向的内存空间在程序运行过程中可以改变，而引用所绑定的对象一旦初始化绑定就不能改变。
* 是否占内存:
  指针本身在内存中占有内存空间，引用相当于变量的别名，在内存中不占内存空间（实际底层编译器可能用指针实现的引用），当我们使用 `&` 对引用取地址时，将会得到绑定对象的地址。

```
#include <iostream>
using namespace std;

int main() 
{ 
    int a = 10;
    int &b = a;
    cout<<&a<<endl;
    cout<<&b<<endl;
    return 0;
}

```

* 是否可为空：
  指针可以定义时不用初始化直接悬空，但是引用初始化时必须绑定对象。
* 是否能为多级
  指针可以有多级，但是引用只能一级。我们可以定义指针的指针，但不能定义引用的引用。

参考资料：

* [Differences between pointers and references in C++](https://leetcode.cn/link/?target=https://www.educative.io/answers/differences-between-pointers-and-references-in-cpp)
* [Pointers vs References in C++](https://leetcode.cn/link/?target=https://www.***.org/pointers-vs-references-cpp/)
* [What are the differences between a pointer variable and a reference variable?](https://leetcode.cn/link/?target=https://stackoverflow.com/questions/57483/what-are-the-differences-between-a-pointer-variable-and-a-reference-variable)

#### 05. 常量指针和指针常量的区别 5

面试高频指数：★★★★★

1. 常量指针：
   常量指针本质上是个指针，只不过这个指针指向的对象是常量。
   特点：`const` 的位置在指针声明运算符 `*` 的左侧。只要 `const` 位于 `*` 的左侧，无论它在类型名的左边或右边，都表示指向常量的指针。（可以这样理解：`*` 左侧表示指针指向的对象，该对象为常量，那么该指针为常量指针。）

constint * p;
intconst * p;

* `注意 1`：指针指向的对象不能通过这个指针来修改，也就是说常量指针可以被赋值为变量的地址，之所以叫做常量指针，是限制了通过这个指针修改变量的值。
  例如：

```
#include <iostream>
using namespace std;

int main()
{
    const int c_var = 8;
    const int *p = &c_var; 
    *p = 6;            // error: assignment of read-only location '* p'
    return 0;
}


```

* `注意 2`：虽然常量指针指向的对象不能变化，可是因为常量指针本身是一个变量，因此，可以被重新赋值。
  例如：

```
#include <iostream>
using namespace std;

int main()
{
    const int c_var1 = 8;
    const int c_var2 = 8;
    const int *p = &c_var1; 
    p = &c_var2;
    return 0;
}

```

2. 指针常量：
   指针常量的本质上是个常量，只不过这个常量的值是一个指针。
   特点：`const` 位于指针声明操作符右侧，表明该对象本身是一个常量，`*` 左侧表示该指针指向的类型，即以 `*` 为分界线，其左侧表示指针指向的类型，右侧表示指针本身的性质。

constint var;
int * const c_p = &var;

* `注意 1`：指针常量的值是指针，这个值因为是常量，所以指针本身不能改变。

```
#include <iostream>
using namespace std;

int main()
{
    int var, var1;
    int * const c_p = &var;
    c_p = &var1; // error: assignment of read-only variable 'c_p'
    return 0;
}

```

* `注意 2`：指针的内容可以改变。
  ```
  #include <iostream>
  using namespace std;

  int main()
  {
      int var = 3;
      int * const c_p = &var;
      *c_p = 12; 
      return 0;
  }

  ```

3. 指向常量的指针常量:
   指向常量的指针常量，指针的指向不可修改，指针所指的内存区域中的值也不可修改。

```
#include <iostream>
using namespace std;

int main()
{
    int var, var1;
    const int * const c_p = &var;
    c_p = &var1; // error: assignment of read-only variable 'c_p'
    *c_p = 12; // error: assignment of read-only location '*c_p'
    return 0;
}

```

4. 部分特例:
   根据前三部分的结论，我们可以得到以下代码的表示内容:

```
int ** const p;  // p 是一指针常量，它是一个指向指针的指针常量；
int * const * p; // p 是一个指针，它是一个指向指针常量的指针；
int const ** p;  // p 是一个指针，它是一个指向常量的指针的指针；
int * const * const p; // p 是一指针常量，它是一个指向指针常量的指针常量；


```

参考资料：

* [What is the difference between const int*, const int * const, and int const *?](https://leetcode.cn/link/?target=https://stackoverflow.com/questions/1143262/what-is-the-difference-between-const-int-const-int-const-and-int-const)
* [9.8 — Pointers and const](https://leetcode.cn/link/?target=https://www.learncpp.com/cpp-tutorial/pointers-and-const/)
* [Difference between const int*, const int * const, and int const *](https://leetcode.cn/link/?target=https://www.***.org/difference-between-const-int-const-int-const-and-int-const/)

#### 06. 函数指针的定义 5

面试高频指数：★★★★★

1. 函数指针：
   函数指针本质是一个指针变量，只不过这个指针指向一个函数。函数指针即指向函数的指针。我们知道所有的函数最终的编译都生成代码段，每个函数的都只是代码段中一部分而已，在每个函数在代码段中都有其调用的起始地址与结束地址，因此我们可以用指针变量指向函数的在代码段中的起始地址。

```
#include <iostream>
using namespace std;
int fun1(int tmp1, int tmp2)
{
  return tmp1 * tmp2;
}
int fun2(int tmp1, int tmp2)
{
  return tmp1 / tmp2;
}

int main()
{
  int (*fun)(int x, int y); 
  fun = fun1; // ok
  fun = &fun1; // ok 两种写法均可以
  cout << fun(15, 5) << endl; 
  fun = fun2;
  cout << fun(15, 5) << endl; 
  cout<<sizeof(fun1)<<endl; // error
  cout<<sizeof(&fun1)<<endl;
  return 0;
}
/*
运行结果：
75
3
*/

```

需要注意的是，对于 `fun1` 和 `&fun1`:

* 函数名 `fun1` 存放的是函数的首地址，它是一个函数类型 `void`，`&fun1` 表示一个指向函数对象 `fun1` 的地址，是一个指针类型。它的类型是 `int (*)(int,int)`，因此 `fun1` 和 `&fun1` 的值是一样的；
* `&fun1` 是一个表达式，函数此时作为一个对象，取对象的地址，该表达式的值是一个指针。
* 通过打印 `sizeof` 即可知道 `fun1` 与 `&fun1` 的区别；

参考资料：

* [为什么c语言中对函数名取地址和解引用得到的值一样？](https://leetcode.cn/link/?target=https://www.zhihu.com/question/293674445)
* [Use of &#39;&amp;&#39; operator before a function name in C++](https://leetcode.cn/link/?target=https://stackoverflow.com/questions/23776784/use-of-operator-before-a-function-name-in-c)

#### 07. 参数传递中：值传递、引用传递、指针传递的区别 5

面试高频指数：★★★★★

1. 参数传递的三种方式：

* 值传递：形参是实参的拷贝，函数对形参的所有操作不会影响实参。形参是实参的拷贝，改变形参的值并不会影响外部实参的值。从被调用函数的角度来说，值传递是单向的（实参->形参），参数的值只能传入。当函数内部可能需要改变参数具体的内容时，我们则采用形参，在组成原理上来说，对于值传递的方式我们采用直接寻址。
* 指针传递：本质上是值传递，只不过拷贝的是指针的值，拷贝之后实参和形参是不同的指针，但指向的地址都相同。通过指针可以间接的访问指针所指向的对象，从而可以修改它所指对象的值。在组成原理上来说，对于指针传递的方式一般采用间接寻址。
* 引用传递：当形参是引用类型时，我们说它对应的实参被引用传递。当然不同的编译器对于引用有不同的实现，部分编译器在底层也是使用指针来实现引用传递。

```
#include <iostream>
using namespace std;

void fun1(int tmp){ // 值传递
    cout << &tmp << endl;
}

void fun2(int * tmp){ // 指针传递
    cout << tmp << endl;
}

void fun3(int &tmp){ // 引用传递
    cout << &tmp << endl;
}

int main()
{
    int var = 5;
    cout << "var 在主函数中的地址：" << &var << endl;

    cout << "var 值传递时的地址：";
    fun1(var);

    cout << "var 指针传递时的地址：";
    fun2(&var);

    cout << "var 引用传递时的地址：";
    fun3(var);
    return 0;
}

/*
运行结果：
var 在主函数中的地址：0x23fe4c
var 值传递时的地址：0x23fe20
var 指针传递时的地址：0x23fe4c
var 引用传递时的地址：0x23fe4c
*/

```

说明：从上述代码的运行结果可以看出，只有在值传递时，形参和实参的地址不一样，在函数体内操作的不是变量本身。引用传递和指针传递，在函数体内操作的是变量本身。
我们知道函数调用的方式，大部分的编译器按照函数形参定义的逆序，依次将参数压入栈内，上述提到参数的形式，如果是值传递，则压入栈中的是一个临时变量，该变量与传入的值内容相同；如果是指针传递或者引用传递，则压入栈的可能是一个临时的指针变量，该指针指向与传入的指针指向的内容相同。从函数调用机制来开，不管何种调用所有实参的传入时都在栈中开辟了空间。

参考资料：

* [c++值传递，指针传递，引用传递以及指针与引用的区别](https://leetcode.cn/link/?target=https://www.cnblogs.com/huolong-blog/p/7588335.html)
* [C++中引用传递与指针传递区别（进一步整理）](https://leetcode.cn/link/?target=https://www.iteye.com/blog/xinklabi-653643)

#### 08. 迭代器的作用 5

面试高频指数：★★★★★

迭代器：一种抽象的设计概念，在设计模式中有迭代器模式，即提供一种方法，使之能够依序寻访某个容器所含的各个元素，而无需暴露该容器的内部表述方式。迭代器只是一种概念上的抽象，具有迭代器通用功能和方法的对象都可以叫做迭代器。迭代器有很多不同的能力，可以把抽象容器和通用算法有机的统一起来。迭代器基本分为五种，输入输出迭代器，前向逆向迭代器，双向迭代器和随机迭代器。

* 输入迭代器(`Input Iterator`)：只能向前单步迭代元素，不允许修改由该迭代器所引用的元素；
* 输出迭代器(`Output Iterator`)：只能向前单步迭代元素，对由该迭代器所引用的元素只有写权限；
* 向前迭代器(`Forward Iterator`)：该迭代器可以在一个区间中进行读写操作，它拥有输入迭代器的所有特性和输出迭代器的部分特性，以及向前单步迭代元素的能力；
* 双向迭代器(`Bidirectional Iterator`)：在向前迭代器的基础上增加了向后单步迭代元素的能力；
* 随机访问迭代器(`Random Access Iterator`)：不仅综合以后 `4` 种迭代器的所有功能，还可以像指针那样进行算术计算；
  在 `C++ STL` 中，容器 `vector`、`deque` 提供随机访问迭代器，`list` 提供双向迭代器，`set` 和 `map` 提供向前迭代器。

![5_17_1.png](https://pic.leetcode-cn.com/1661515579-ASMhMu-5_17_1.png)

使用迭代器的优点：

* 代码编写方便：迭代器提供了通用接口来遍历元素，不用担心容器的大小，使用迭代器我们可以简单地使用成员函数 `end()` 来判断容器的结尾，遍历内容方便而简洁；
* 代码可重用性高：：迭代器提供了一组通用的 `api` 访问和遍历容器中的元素。迭代器支持代码的可重用性，它们可以被使用访问任何容器的元素。
* 容器可以动态处理：迭代器能够在需要时方便地从容器中动态添加或删除元素。

```
#include <iostream>
#include <vector>
using namespace std;

int main()
{
    vector<int> arr = {1, 2, 3, 4, 5, 6, 7, 8, 9, 0};
    vector<int>::iterator iter = arr.begin(); // 定义迭代器
    for (; iter != arr.end(); ++iter)
    {
        cout << *iter << " ";
    }
    return 0;
}
/*
运行结果：
1 2 3 4 5 6 7 8 9 0
*/

```

参考资料：

* [Introduction to Iterators in C++](https://leetcode.cn/link/?target=https://www.***.org/introduction-iterators-c/)
* [iterator](https://leetcode.cn/link/?target=https://cplusplus.com/reference/iterator/)
* [Iterators in C++ STL](https://leetcode.cn/link/?target=https://www.***.org/iterators-c-stl/)
* [std::iterator](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/iterator/iterator)
* [C++ Iterators](https://leetcode.cn/link/?target=https://users.cs.northwestern.edu/~riesbeck/programming/c++/stl-iterators.html)

#### 09. 野指针和悬空指针详解 4

面试高频指数：★★★★☆

* 悬空指针：
  若指针指向一块内存空间，当这块内存空间被释放后，该指针依然指向这块内存空间，此时，称该指针为“悬空指针”。如果对悬空指针再次释放可能会出现不可预估的错误，比如可能该段内存被别的程序申请使用了，而此时对该段内存进行释放可能会产生不可预估的后果。
  举例：

```
void *p = malloc(size);
free(p); // 此时，p 指向的内存空间已释放， p 就是悬空指针。
p = NULL;
```

* 野指针：
  “野指针” 是指不确定其指向的指针，未初始化的指针为“野指针”，未初始化的指针的初始值可能是随机的，如果使用未初始化的指针可能会导致段错误，从而程序会崩溃。

```
void *p; 
// 此时 p 是“野指针”。
```

* 如何避免野指针:
  指针在定义时即初始化，指针在释放完成后，需要将其置为空。

参考资料：

* [野指针](https://leetcode.cn/link/?target=https://baike.baidu.com/item/%E9%87%8E%E6%8C%87%E9%92%88/9654046?fr=aladdin)
* [What are Wild Pointers? How can we avoid?](https://leetcode.cn/link/?target=https://www.***.org/what-are-wild-pointers-how-can-we-avoid/)
* [What are Wild Pointers in C/C++?](https://leetcode.cn/link/?target=https://www.tutorialspoint.com/what-are-wild-pointers-in-c-cplusplus)

#### 10. 强制类型转换的类型 4

面试高频指数：★★★★☆

1. `static_cast`：
   `static_cast` 是“静态转换”的意思，也即在编译期间转换，转换失败的话会抛出一个编译错误。一般用于如下:

* 用于数据的强制类型转换，强制将一种数据类型转换为另一种数据类型。
* 用于基本数据类型的转换。
* 用于类层次之间的基类和派生类之间指针或者引用的转换（不要求必须包含虚函数，但必须是有相互联系的类），进行上行转换（派生类的指针或引用转换成基类表示）是安全的；进行下行转换（基类的指针或引用转换成派生类表示）由于没有动态类型检查，所以是不安全的，最好用 `dynamic_cast` 进行下行转换。
* 可以将空指针转化成目标类型的空指针。
* 可以将任何类型的表达式转化成 `void` 类型。
* 不能用于在不同类型的指针之间互相转换，也不能用于整型和指针之间的互相转换，当然也不能用于不同类型的引用之间的转换。

2. `const_cast`：
   主要用于 `const` 与非 `const`、`volatile` 与非 `volatile` 之间的转换。强制去掉常量属性，不能用于去掉变量的常量性，只能用于去除指针或引用的常量性，将常量指针转化为非常量指针或者将常量引用转化为非常量引用（注意：表达式的类型和要转化的类型是相同的）。
3. `reinterpret_cast`：
   改变指针或引用的类型、将指针或引用转换为一个足够长度的整型、将整型转化为指针或引用类型。`reinterpret_cast` 转换时，执行的过程是逐个比特复制的操作。
4. `dynamic_cast`：

* 其他三种都是编译时完成的，动态类型转换是在程序运行时处理的，运行时会进行类型检查。
* 只能用于带有虚函数的基类或派生类的指针或者引用对象的转换，转换成功返回指向类型的指针或引用，转换失败返回 `NULL`；不能用于基本数据类型的转换。
* 在向上进行转换时，即派生类的指针转换成基类的指针和 `static_cast` 效果是一样的，（注意：这里只是改变了指针的类型，指针指向的对象的类型并未发生改变）。

```
#include <iostream>
#include <cstring>

using namespace std;

class Base
{
};

class Derive : public Base
{
};

int main()
{
    Base *p1 = new Derive();
    Derive *p2 = new Derive();

    //向上类型转换
    p1 = dynamic_cast<Base *>(p2);
    if (p1 == NULL)
    {
        cout << "NULL" << endl;
    }
    else
    {
        cout << "NOT NULL" << endl; //输出
    }

    return 0;
}

```

* 在下行转换时，基类的指针类型转化为派生类的指针类型，只有当要转换的指针指向的对象类型和转化以后的对象类型相同时，才会转化成功。

```
#include <iostream>
#include <cstring>

using namespace std;

class Base
{
public:
    virtual void fun()
    {
        cout << "Base::fun()" << endl;
    }
};

class Derive : public Base
{
public:
    virtual void fun()
    {
        cout << "Derive::fun()" << endl;
    }
};

int main()
{
    Base *p1 = new Derive();
    Base *p2 = new Base();
    Derive *p3 = new Derive();

    //转换成功
    p3 = dynamic_cast<Derive *>(p1);
    if (p3 == NULL)
    {
        cout << "NULL" << endl;
    }
    else
    {
        cout << "NOT NULL" << endl; // 输出
    }

    //转换失败
    p3 = dynamic_cast<Derive *>(p2);
    if (p3 == NULL)
    {
        cout << "NULL" << endl; // 输出
    }
    else
    {
        cout << "NOT NULL" << endl;
    }

    return 0;
}

```

参考资料：

* [为什么说不要使用 dynamic_cast，需要运行时确定类型信息，说明设计有缺陷？](https://leetcode.cn/link/?target=https://www.zhihu.com/question/22445339)
* [C++四种类型转换运算符：static_cast、dynamic_cast、const_cast和reinterpret_cast](https://leetcode.cn/link/?target=http://c.biancheng.net/cpp/biancheng/view/3297.html)
* [static_cast reinterpret_cast dynamic_cast const_cast](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/352766472)
* [(C++ 成长记录) —— C++强制类型转换运算符（static_cast、reinterpret_cast、const_cast和dynamic_cast）](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/368267441)
* [When should static_cast, dynamic_cast, const_cast, and reinterpret_cast be used?](https://leetcode.cn/link/?target=https://stackoverflow.com/questions/332030/when-should-static-cast-dynamic-cast-const-cast-and-reinterpret-cast-be-used)
* [C++中的类型转换（static_cast、const_cast、dynamic_cast、reinterpret_cast）](https://leetcode.cn/link/?target=https://blog.csdn.net/u012611878/article/details/78992132)
* [Cast Operations](https://leetcode.cn/link/?target=https://docs.oracle.com/cd/E19422-01/819-3690/Cast.html)

#### 11. 什么是类型萃取 4

面试高频指数：★★★★☆

类型萃取（`type traits`）使用模板技术来萃取类型（包含自定义类型和内置类型）的某些特性，用以判断该类型是否含有某些特性，从而在泛型算法中来对该类型进行特殊的处理用来提高效率或者得到其他优化。简单的来说类型萃取即确定变量去除引用修饰以后的真正的变量类型或者 `CV` 属性。`C++` 关于 `type traits` 的详细使用技巧可以参考头文件 `#include <type_traits>`。

* 为什么需要 `type traits`：
  对于普通的变量来说，确定变量的类型比较容易，比如 `int a = 10;` 可以很容易确定变量的实际类型为 `int`，但在使用模板时确定变量的类型就比较困难，模板传入的类型为不确定性。为什么需要确定变量的实际类型？因为模板函数针对传入的对不同的类型可能作出不同的处理，这就需要我们在处理函数模板对传入的参数类型和特性进行提取。比如自定义拷贝函数 `copy(T *dest, const T *src)` ，如果 `T` 此时为 `int` 类型，则此时我们只需要 `*dest = *src` 即可，但是如果我们此时传入的 `T` 为 `char *` 字符串类型时，则就不能简单进行指针赋值，所以函数在实际处理时则需要对传入的类型进行甄别，从而针对不同的类型给予不同的处理，这样才能使得函数具有通用性。
* `remove_reference_t` 的原理：
  `move` 函数在进行强制类型转换时，会使用到 `remove_reference_t`，该函数的作用是确定函数除去 `C-V` 和引用后的类型。以下为 `move` 的具体实现:

```
template<typename T>
remove_reference_t<T>&& move(T&& t) {
    return static_cast<remove_reference_t<T>&&>(t);
}

```

通过 `remove_reference_t<T>` 可以把 `t` 对应的类型上的引用给去掉，然后把 `t` 对应的类型的右值引用符号 `&&` 强制绑定在变量 `t` 上，这样就强制将变量 `t` 转换为右值引用类型。`remove_reference` 函数的原型如下:

```
/// remove_reference
template<typename _Tp>
struct remove_reference
{ typedef _Tp   type; };

template<typename _Tp>
struct remove_reference<_Tp&>
{ typedef _Tp   type; };

template<typename _Tp>
struct remove_reference < _Tp&& >
{ typedef _Tp   type; };

```

* 函数的实现非常简单，去掉绑定在类型中的引用，返回一个 实际类型 `type`。
* `C++` 类型萃取一般用于模板中，当我们定义一个模板函数后，需要知道模板类型形参并加以运用时就奥数可以用类型萃取。通过确定变量的特征我们可以在模板中使用不同的处理方法。

参考资料：

* [Type Traits](https://leetcode.cn/link/?target=https://www.youtube.com/watch?v=eVtLOHoDbTo)
* [A quick primer on type traits in modern C++](https://leetcode.cn/link/?target=https://www.internalpointers.com/post/quick-primer-type-traits-modern-cpp)
* [C++之类型萃取](https://leetcode.cn/link/?target=https://blog.csdn.net/xuzhangze/article/details/78374890)

#### 12. C++ 11 nullptr 比 NULL 的优势比较 3

面试高频指数：★★★☆☆

* `NULL`：预处理变量，是一个宏，它的值是 `0`，定义在头文件 `<cstdlib>` 中，即 `#define NULL 0`。
* `nullptr`：`C++ 11` 中的关键字，是一种特殊类型的字面值，可以被转换成任意其他类型。

二者相比 `nullptr` 的优势：

* 有类型，类型是 `typdef decltype(nullptr) nullptr_t;`，使用 `nullptr` 提高代码的健壮性。
* 函数重载：因为 `NULL` 本质上是 `0`，在函数调用过程中，若出现函数重载并且传递的实参是 `NULL`，可能会出现不知和哪一个函数匹配的情况；但是传递实参 `nullptr` 就不会出现这种情况。

```
#include <iostream>
#include <cstring>
using namespace std;

void fun(char const *p)
{
    cout << "fun(char const *p)" << endl;
}

void fun(int tmp)
{
    cout << "fun(int tmp)" << endl;
}

int main()
{
    fun(nullptr); // fun(char const *p)
    /*
    fun(NULL); // error: call of overloaded 'fun(NULL)' is ambiguous
    */
    return 0;
}


```

参考资料：

* [nullptr (C++/CLI and C++/CX)](https://leetcode.cn/link/?target=https://docs.microsoft.com/en-us/cpp/extensions/nullptr-cpp-component-extensions?view=msvc-170)
* [Understanding nullptr in C++](https://leetcode.cn/link/?target=https://www.***.org/understanding-nullptr-c/)

#### 13. 结构体相等的判断方式及 memcmp 函数的使用 3

面试高频指数：★★★☆☆

1. 符号重载：
   需要重载操作符 `==` 判断两个结构体是否相等，不能用函数 `memcmp` 来判断两个结构体是否相等，因为 `memcmp` 函数是逐个字节进行比较的，而结构体存在内存空间中保存时存在字节对齐，字节对齐时补的字节内容是随机的，会产生垃圾值，所以无法比较。
   利用运算符重载来实现结构体对象的比较：

```
#include <iostream>

using namespace std;

struct A
{
    char c;
    int val;
    A(char c_tmp, int tmp) : c(c_tmp), val(tmp) {}

    friend bool operator==(const A &tmp1, const A &tmp2); //  友元运算符重载函数
};

bool operator==(const A &tmp1, const A &tmp2)
{
    return (tmp1.c == tmp2.c && tmp1.val == tmp2.val);
}

int main()
{
    A ex1('a', 90), ex2('b', 80);
    if (ex1 == ex2)
        cout << "ex1 == ex2" << endl;
    else
        cout << "ex1 != ex2" << endl; // 输出
    return 0;
}

```

参考资料：

* [判断结构体相等](https://leetcode.cn/link/?target=https://www.jianshu.com/p/857703dcc7db?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation)
* [No == operator found while comparing structs in C++](https://leetcode.cn/link/?target=https://stackoverflow.com/questions/5740310/no-operator-found-while-comparing-structs-in-c)

#### 14. 模板及其实现 3

面试高频指数：★★★☆☆

1. 模板：创建类或者函数的蓝图或者公式，分为函数模板和类模板。
   实现方式：模板定义以关键字 `template` 开始，后跟一个模板参数列表。
   模板参数列表不能为空；
   模板类型参数前必须使用关键字 `class` 或者 `typename`，在模板参数列表中这两个关键字含义相同，可互换使用。

`template <typename T, typename U, ...>`

2. 函数模板：通过定义一个函数模板，可以避免为每一种类型定义一个新函数。

* 对于函数模板而言，模板类型参数可以用来指定返回类型或函数的参数类型，以及在函数体内用于变量声明或类型转换。
* 函数模板实例化：当调用一个模板时，编译器用函数实参来推断模板实参，从而使用实参的类型来确定绑定到模板参数的类型。

```
#include<iostream>

using namespace std;

template <typename T>
T add_fun(const T & tmp1, const T & tmp2){
    return tmp1 + tmp2;
}

int main(){
    int var1, var2;
    cin >> var1 >> var2;
    cout << add_fun(var1, var2);

    double var3, var4;
    cin >> var3 >> var4;
    cout << add_fun(var3, var4);
    return 0;
}

```

3. 类模板：类似函数模板，类模板以关键字 `template` 开始，后跟模板参数列表。但是，编译器不能为类模板推断模板参数类型，需要在使用该类模板时，在模板名后面的尖括号中指明类型。

```
#include <iostream>

using namespace std;

template <typename T>
class Complex
{
public:
    //构造函数
    Complex(T a, T b)
    {
        this->a = a;
        this->b = b;
    }

    //运算符重载
    Complex<T> operator+(Complex &c)
    {
        Complex<T> tmp(this->a + c.a, this->b + c.b);
        cout << tmp.a << " " << tmp.b << endl;
        return tmp;
    }

private:
    T a;
    T b;
};

int main()
{
    Complex<int> a(10, 20);
    Complex<int> b(20, 30);
    Complex<int> c = a + b;

    return 0;
}

```

4. 变量模板：
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

5. 函数重载与模板的区别:
   函数重载和模板都是面向对象多态特性的例子。当多个函数执行非常相似（不相同）的操作时使用函数重载，当多个函数执行相同操作时使用模板，函数模板也可以重载。当模板类或者模板函数中含有静态变量时，则每个模板的实例类型都含有一个静态成员。

```
template <class T>
class A { 
  public: 
	static T val; 
}; 
A<int> a; // 含有静态成员 int val;
A<string> b; // 含有静态成员 string val;


```

参考资料：

* [Templates in C++ with Examples](https://leetcode.cn/link/?target=https://www.***.org/templates-cpp/)
* [C++ 模板](https://leetcode.cn/link/?target=https://www.runoob.com/cplusplus/cpp-templates.html)
* [Templates (C++)](https://leetcode.cn/link/?target=https://docs.microsoft.com/en-us/cpp/cpp/templates-cpp?view=msvc-170)
* [Template (C++)](https://leetcode.cn/link/?target=https://en.wikipedia.org/wiki/Template_(C%2B%2B))


#### 15. 函数模板和类模板的区别 3

面试高频指数：★★★☆☆

* 实例化方式不同：函数模板实例化由编译程序在处理函数调用时自动完成，类模板实例化需要在程序中显式指定。
* 实例化的结果不同：函数模板实例化后是一个函数，类模板实例化后是一个类。
* 默认参数：函数模板不允许有默认参数，类模板在模板参数列表中可以有默认参数。
* 特化：函数模板只能全特化；而类模板可以全特化，也可以偏特化。
* 调用方式不同：函数模板可以进行类型推导，可以隐式调用，也可以显式调用；类模板只能显式调用。
  函数模板调用方式举例：

```
#include<iostream>

using namespace std;

template <typename T>
T add_fun(const T & tmp1, const T & tmp2){
    return tmp1 + tmp2;
}

int main(){
    int var1, var2;
    cin >> var1 >> var2;
    cout << add_fun<int>(var1, var2); // 显式调用

    double var3, var4;
    cin >> var3 >> var4;
    cout << add_fun(var3, var4); // 隐式调用
    return 0;
}

```

参考资料：

* [函数模板与类模板](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/381299879)
* [Difference between Class Template and Function Template](https://leetcode.cn/link/?target=https://stackoverflow.com/questions/14040329/difference-between-class-template-and-function-template)
* [Templates in C++ with Examples](https://leetcode.cn/link/?target=https://www.***.org/templates-cpp/)
* [C++ Function Template and Class Template](https://leetcode.cn/link/?target=https://programmer.group/c-function-template-and-class-template.html)
* [Templates in C++](https://leetcode.cn/link/?target=https://www.mygreatlearning.com/blog/templates-in-cpp/)


#### 16. 什么是模板特化 3

面试高频指数：★★★☆☆

模板特化的原因：模板并非对任何模板实参都合适、都能实例化，某些情况下，通用模板的定义对特定类型不合适，可能会编译失败，或者得不到正确的结果。因此，当不希望使用模板版本时，可以定义类或者函数模板的一个特例化版本。
模板特化：模板参数在某种特定类型下的具体实现。分为函数模板特化和类模板特化

* 函数模板特化：将函数模板中的全部类型进行特例化，称为函数模板特化。
* 类模板特化：将类模板中的部分或全部类型进行特例化，称为类模板特化。
  特化分为全特化和偏特化：
* 全特化：模板中的模板参数全部特例化。
* 偏特化：模板中的模板参数只确定了一部分，剩余部分需要在编译器编译时确定。
  说明：要区分下函数重载与函数模板特化
  定义函数模板的特化版本，本质上是接管了编译器的工作，为原函数模板定义了一个特殊实例，而不是函数重载，函数模板特化并不影响函数匹配。

```
#include <iostream>
#include <cstring>

using namespace std;
//函数模板
template <class T>
bool compare(T t1, T t2)
{
    cout << "通用版本：";
    return t1 == t2;
}

template <> //函数模板特化
bool compare(char *t1, char *t2)
{
    cout << "特化版本：";
    return strcmp(t1, t2) == 0;
}

int main(int argc, char *argv[])
{
    char arr1[] = "hello";
    char arr2[] = "abc";
    cout << compare(123, 123) << endl;
    cout << compare(arr1, arr2) << endl;

    return 0;
}
/*
运行结果：
通用版本：1
特化版本：0
*/

```

参考资料：

* [模板特化](https://leetcode.cn/link/?target=https://blog.csdn.net/langminglang/article/details/64160983)
* [模板特化](https://leetcode.cn/link/?target=https://baike.baidu.com/item/%E6%A8%A1%E6%9D%BF%E7%89%B9%E5%8C%96/18760185)


#### 17. 泛型编程如何实现 3

面试高频指数：★★★☆☆

泛型编程实现的基础：模板。模板是创建类或者函数的蓝图或者说公式，当时用一个 `vector` 这样的泛型，或者 `find` 这样的泛型函数时，编译时会转化为特定的类或者函数。
泛型编程涉及到的知识点较广，例如：容器、迭代器、算法等都是泛型编程的实现实例。面试者可选择自己掌握比较扎实的一方面进行展开。

* 容器：涉及到 `STL` 中的容器，例如：`vector`、`list`、`map` 等，可选其中熟悉底层原理的容器进行展开讲解。
* 迭代器：在无需知道容器底层原理的情况下，遍历容器中的元素。
* 模板：可参考本章节中的模板相关问题。

泛型编程优缺点：

* 通用性强：泛型算法是建立在语法一致性上，运用到的类型集是无限的/非绑定的。
* 效率高：编译期能确定静态类型信息，其效率与针对某特定数据类型而设计的算法相同。
* 类型检查严：静态类型信息被完整的保存在了编译期，在编译时可以发现更多潜在的错误。
* 二进制复用性差：泛型算法是建立在语法一致性上，语法是代码层面的，语法上的约定无法体现在机器指令中。泛型算法实现的库，其源代码基本上是必须公开的，引用泛型中库都需要重新编译生成新的机器指令。而传统的 `C` 库全是以二进制目标文件形式发布的，需要使用这些库时直接动态链接加载使用即可，不需要进行再次编译。

参考资料：

* [泛型编程](https://leetcode.cn/link/?target=https://baike.baidu.com/item/%E6%B3%9B%E5%9E%8B%E7%BC%96%E7%A8%8B/6787248?fr=aladdin)
* [泛型编程](https://leetcode.cn/link/?target=https://www.jianshu.com/p/62aa00e2be32)


#### 18. switch 的 case 里为何不建议定义变量 3

面试高频指数：★★★☆☆

`switch` 下面的这个花括号表示一块作用域，而不是每一个 `case` 表示一块作用域。如果在某一 `case` 中定义了变量，其作用域在这块花括号内，按理说在另一个 `case` 内可以使用该变量，但是在实际使用时，每一个 `case` 之间互不影响，是相对封闭的，参考如下实例。

实例：
下述代码中，在 `switch` 的 `case` 中定义的变量，没有实际意义，仅为了解释上述原因。

```
#include <iostream>
using namespace std;

int main()
{
    // 局部变量声明
    char var = 'D';

    switch (var)
    {
    case 'A':
        int cnt = 0; // 定义变量
        cout << "Excellent." << endl
             << cnt;
        break;
    case 'B':
    case 'C':
        ++cnt;
        cout << "Good." << endl
             << cnt;
        break;
    case 'D':
        cout << "Not bad." << endl
             << cnt;
        break;
    case 'F':
        cout << "Bad." << endl
             << cnt;
        break;
    default:
        cout << "Bad." << endl
             << cnt;
    }

    return 0;
}

```

简单解释：上述代码中在符合 `A` 的条件下定义了变量，当符合 `B` 或者 `C` 的条件时，对该变量进行自增操作，但是因为不符合条件 `A` 未对变量进行定义，该变量无法使用。


#### 19. 什么是可变参数模板 2

面试高频指数：★★☆☆☆

对于可变参数函数，在 `C` 语言中我们最熟悉的就是 `printf` 函数:

```
int printf(const char *format, ...)
```

在 `C++` 中的模板也可以支持可变参数：
可变参数模板：接受可变数目参数的模板函数或模板类。将可变数目的参数被称为参数包，包括模板参数包和函数参数包。

* 模板参数包：表示零个或多个模板参数；
* 函数参数包：表示零个或多个函数参数。
  用省略号来指出一个模板参数或函数参数表示一个包，在模板参数列表中，`class...` 或 `typename...` 指出接下来的参数表示零个或多个类型的列表；一个类型名后面跟一个省略号表示零个或多个给定类型的非类型参数的列表。当需要知道包中有多少元素时，可以使用 `sizeof...` 运算符。

```
template <typename T, typename... Args> // Args 是模板参数包
void foo(const T &t, const Args&... rest); // 可变参数模板，rest 是函数参数包

```

实例：

```
#include <iostream>

using namespace std;

template <typename T>
void print_fun(const T &t)
{
    cout << t << endl; // 最后一个元素
}

template <typename T, typename... Args>
void print_fun(const T &t, const Args &...args)
{
    cout << t << " ";
    print_fun(args...);
}

int main()
{
    print_fun("Hello", "world", "!");
    return 0;
}
/*运行结果：
Hello wolrd !

*/

```

说明：可变参数函数通常是递归的，第一个版本的 `print_fun` 负责终止递归并打印初始调用中的最后一个实参。第二个版本的 `print_fun` 是可变参数版本，打印绑定到 `t` 的实参，并用来调用自身来打印函数参数包中的剩余值。

参考资料：

* [c++11-17 模板核心知识（四）—— 可变参数模板 Variadic Template](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/338785886)
* [可变参数模板是什么](https://leetcode.cn/link/?target=https://www.leixue.com/qa/what-are-variable-parameter-templates)
