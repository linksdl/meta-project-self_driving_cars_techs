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
