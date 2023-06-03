### 6，设计模式

本章将重点涉及以下高频知识点：

1. [单例模式及其实现](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/v0xdyi/)
2. [工厂模式及其实现](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/v05n1e/)
3. [观察者模式及其实现](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/v09msg/)
4. [常见设计模式](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/v0hlcc/)



#### 01. 单例模式及其实现 5

面试高频指数：★★★★★

 **单例模式** ：保证类的实例化对象仅有一个，并且提供一个访问他的全局访问点。

 **应用场景** ：

* 表示文件系统的类，一个操作系统一定是只有一个文件系统，因此文件系统的类的实例有且仅有一个。
* 打印机打印程序的实例，一台计算机可以连接好几台打印机，但是计算机上的打印程序只有一个，就可以通过单例模式来避免两个打印作业同时输出到打印机。

**实现方式：**
单例模式可以通过全局或者静态变量的形式实现，这样比较简单，但是这样会影响封装性，难以保证别的代码不会对全局变量造成影响。

* **默认的构造函数、拷贝构造函数、赋值构造函数声明为私有的** ，这样禁止在类的外部创建该对象；
* 全局访问点也要定义成  **静态类型的成员函数** ，没有参数，返回该类的指针类型。因为使用实例化对象的时候是通过类直接调用该函数，并不是先创建一个该类的对象，通过对象调用。

不安全的实现方式：
原因：考虑当两个线程同时调用 `getInstance` 方法，并且同时检测到 `instance` 是 `NULL`，两个线程会同时实例化对象，不符合单例模式的要求。

```
class Singleton{
private:
    static Singleton * instance;
    Singleton(){}
    Singleton(const Singleton& tmp){}
    Singleton& operator=(const Singleton& tmp){}
public:
    static Singleton* getInstance(){
        if(instance == NULL){
            instance = new Singleton();
        }
        return instance;
    }
};
Singleton* Singleton::instance = NULL;

```


**分类：**

* 懒汉模式：直到第一次用到类的实例时才去实例化，上面是懒汉实现。
* 饿汉模式：类定义的时候就实例化。

线程安全的懒汉模式实现：
方法：**加锁**
存在的问题：每次判断实例对象是否为空，都要被锁定，如果是多线程的话，就会造成大量线程阻塞。

```
class Singleton{
private:
    static pthread_mutex_t mutex;
    static Singleton * instence;
    Singleton(){
        pthread_mutex_init(&mutex, NULL); 
    }
    Singleton(const Singleton& tmp){}
    Singleton& operator=(const Singleton& tmp){}
public:
    static Singleton* getInstence(){
        pthread_mutex_lock(&mutex);
        if(instence == NULL){    
            instence = new Singleton();    
        }
        pthread_mutex_unlock(&mutex);
        return instence;
    }
};
Singleton* Singleton::instence = NULL;
pthread_mutex_t Singleton::mutex;

```


方法： **内部静态变量** ，在全局访问点 `getInstance` 中定义静态实例。

```
class Singleton{
private:
    static pthread_mutex_t mutex;
    Singleton(){
        pthread_mutex_init(&mutex, NULL);
    }
    Singleton(const Singleton& temp){}
    Singleton& operator=(const Singleton& temp){}
public:
    static Singleton* getInstence(){ 
        static Singleton instence;
        return &instence;
    }
};
pthread_mutex_t Singleton::mutex; 

```

饿汉模式的实现：
饿汉模式本身就是线程安全的不用加锁。

```
class Singleton{
private:
    static Singleton* instence;
    Singleton(const Singleton& temp){}
    Singleton& operator=(const Singleton& temp){}
protected:
	 Singleton(){} 
public:
    static Singleton* getInstence(){ 
        return instence;  
    }
};
Singleton* Singleton::instence = new Singleton();

```

参考资料:

* [单例模式](https://leetcode.cn/link/?target=https://www.runoob.com/design-pattern/singleton-pattern.html)
* [前言](https://leetcode.cn/link/?target=https://www.cnblogs.com/xiketang/p/15493954.html)
