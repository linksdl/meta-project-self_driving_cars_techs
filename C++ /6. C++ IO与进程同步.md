### 6, C++ I/O 与进程同步

本章将重点涉及以下高频知识点：

1. [C++ 条件变量](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdftj2/)
2. [线程同步与异步](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdbzx5/)
3. [C++ 互斥信号量](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdjqf6/)
4. [C++ I/O 操作](https://leetcode.cn/leetbook/read/cmian-shi-tu-po/vdc157/)

#### 01. C++ 条件变量 5

面试高频指数：★★★★★

1. 条件变量（`condition variable`）：
   在 `C` 语言中我们使用 `pthread_cond_wait` 函数作为条件变量，它是由操作系统实现的条件变量，需要详细了解它的运行机制就可以了解 `C++` 中条件变量的实现。在 `C++ 11` 以后，我们可以使用条件变量（`condition_variable`）实现多个线程间的同步操作；当条件不满足时，相关线程被一直阻塞，直到某种条件出现，这些线程才会被唤醒。`C++` 中包含的头文件在 `#include <condition_variable>` 中。
   条件变量是利用线程间共享的全局变量进行同步的一种机制，主要包括两个动作：

* 一个线程因等待**条件变量的条件成立**而挂起；
* 另外一个线程使**条件成立**从而给出唤醒线程的信号，从而唤醒被等待的线程；
  为了防止竞争，条件变量的使用总是和一个互斥锁结合在一起；通常情况下这个锁是 `std::mutex`，并且管理这个锁只能是 `std::unique_lock std::mutex` 等 `RAII` 模板类。分别是使用以下两个方法实现：
* 等待条件成立使用的是 `condition_variable` 类成员 `wait`、`wait_for` 或 `wait_until`。
* 唤醒信号使用的是 `condition_variable` 类成员 `notify_one` 或者 `notify_all` 函数。

`condition_variable` 支持的函数如下:

* 构造函数: 它只有默认构造函数，拷贝构造函数和赋值符号重载均被禁止 `condition_variable(const condition_variable&) = delete;`，`operator= [delete]`；
* `wait`：`wait` 目前支持 `wait`，`wait_for`，`wait_until` 等三种操作，分别对应不同的场景:
  * `wait`: 对应的函数原型为:

```
void wait( std::unique_lock<std::mutex>& lock ); 
```

当前线程执行时就被阻塞，直到等到被 `notify` 唤醒。在阻塞线程的那一刻，该函数自动调用 `lck.unlock()`，允许其他被 `lck` 锁定的线程继续运行。阻塞时被一旦某个线程 `notify` 时，实际可能为虚假唤醒，该函数将解除阻塞并调用 `lck.lock()`，获取互斥锁。

```
template <class Predicate>
void wait (unique_lock<mutex>& lck, Predicate pred);
```

调用时检查 `pred`，如果为 `false`, 则阻塞线程，并且调用 `lock.unlock()`, 否则，继续执行。阻塞时被一旦某个线程 `notify` 时，实际可能为虚假唤醒，该函数将再次检查 `pred`，如果为 `true`，则解除阻塞并调用 `lck.lock()`，获取互斥锁；否则继续阻塞线程。

* `wait_for`: 对应的函数原型为:
  ```
  template< class Rep, class Period, class Predicate >
  bool wait_for( std::unique_lock<std::mutex>& lock,
      const std::chrono::duration<Rep, Period>& rel_time,
      Predicate stop_waiting);


  ```

调用时，检查两个条件是否满足: `stop_waiting` 返回是否为 `true`，时间是否超时，如果两个条件都不满足，则阻塞线程，并调用 `lock.unlock()`, 否则，到达一定等待时间或满足条件被唤醒。注意等待超过时间段后自动唤醒，判断条件一般需要使用者自己在合适的时候判断，并通过 `notify_one()` 或 `notify_all()` 唤醒，所以在使用时应当通过判断返回值来检测是其由于超时返回还是被正常唤醒，即状态是否为 `std::cv_status::timeout`。程序示例如下:

```
#include <iostream>
#include <atomic>
#include <condition_variable>
#include <thread>
#include <chrono>
using namespace std::chrono_literals;

std::condition_variable cv;
std::mutex cv_m;
int i;

void waits(int idx)
{
    std::unique_lock<std::mutex> lk(cv_m);
    if (cv.wait_for(lk, idx*100ms, []{return i == 1;})) {
        std::cerr << "Thread " << idx << " finished waiting. i == " << i << '\n';
    } else {
        std::cerr << "Thread " << idx << " timed out. i == " << i << '\n';
    }
}

void signals()
{
    std::this_thread::sleep_for(120ms);
    std::cerr << "Notifying...\n";
    cv.notify_all();
    std::this_thread::sleep_for(100ms);
    {
        std::lock_guard<std::mutex> lk(cv_m);
        i = 1;
    }
    std::cerr << "Notifying again...\n";
    cv.notify_all();
}

int main()
{
    std::thread t1(waits, 1), t2(waits, 2), t3(waits, 3), t4(signals);
    t1.join(); // t1 等待 100ms 后未被唤醒，自动超时；
    t2.join(); // t2 在 120 ms 处被唤醒，但 condition 未满足，再此进入阻塞，200ms 时由于超时返回
    t3.join(); // t3 在 120 ms 处被唤醒，但 condition 未满足，再此进入阻塞，220ms 时被 notify ，正常返回。
    t4.join();
}
/*
Thread 1 timed out. i == 0
Notifying...
Thread 2 timed out. i == 0
Notifying again...
Thread 3 timed out. i == 0
*/

```

```
template <class Predicate>
void wait (unique_lock<mutex>& lck, Predicate pred);
```

* `wait_for` 是通过 `wait_until` 实现的，到达指定截止时间或满足条件 `conditions` 时线程即被唤醒。不同的是，到达时间点是自动唤醒，而条件满足 `conditions` 时则是通过 `notify_one()` 或 `notify_all()` 唤醒，使用的时候注意判断返回值，根据返回值确定该线程是被超时唤醒还是被其他线程 `notify` 正常唤醒，即状态是否为 `std::cv_status::timeout`。
* `notify`：
  * `notify_one` 唤醒一个阻塞的线程，线程唤醒的顺序可能是随机的，并没有特定的顺序。
    `notify_one` 程序示例如下，我们可以看到每次唤醒的顺序并不是确定的:

```
// condition_variable::notify_one
#include <iostream>           // std::cout
#include <thread>             // std::thread
#include <mutex>              // std::mutex, std::unique_lock
#include <condition_variable> // std::condition_variable

std::mutex mtx;
std::condition_variable produce,consume;

int cargo = 0;     // shared value by producers and consumers

void consumer () {
std::unique_lock<std::mutex> lck(mtx);
while (cargo==0) consume.wait(lck);
std::cout << cargo << '\n';
cargo=0;
produce.notify_one();
}

void producer (int id) {
std::unique_lock<std::mutex> lck(mtx);
while (cargo!=0) produce.wait(lck);
cargo = id;
consume.notify_one();
}

int main ()
{
std::thread consumers[10],producers[10];
// spawn 10 consumers and 10 producers:
for (int i=0; i<10; ++i) {
    consumers[i] = std::thread(consumer);
    producers[i] = std::thread(producer,i+1);
}

// join them back:
for (int i=0; i<10; ++i) {
    producers[i].join();
    consumers[i].join();
}

return 0;
}

```

* `notify_all` 唤醒所有的阻塞在 `condition_variable` 下的线程。需要特别注意的是，可能唤醒所有阻塞的线程，但是唤醒的多个线程同一时间只能有一个线程可以持有 `lck` 锁，必须等待其执行 `wait` 之后的代码，并释放 `lck` 时，剩余被唤醒的线程才可以执行，我们可以观察到以下程序示例，唤醒的顺序都是随机的。

```
#include <iostream>
#include <condition_variable>
#include <thread>
#include <chrono>

std::condition_variable_any cv;
std::mutex cv_m; // This mutex is used for three purposes:
                // 1) to synchronize accesses to i
                // 2) to synchronize accesses to std::cerr
                // 3) for the condition variable cv
int i = 0;

void waits(int idx)
{
    std::unique_lock<std::mutex> lk(cv_m);
    std::cerr << "Waiting... \n";
    cv.wait(lk, []{return i == 1;});
    std::cerr << "thread:"<< idx <<" ...finished waiting. i == 1\n";
}

void signals()
{
    std::this_thread::sleep_for(std::chrono::seconds(1));
    {
        std::lock_guard<std::mutex> lk(cv_m);
        std::cerr << "Notifying...\n";
    }
    cv.notify_all();

    std::this_thread::sleep_for(std::chrono::seconds(1));

    {
        std::lock_guard<std::mutex> lk(cv_m);
        i = 1;
        std::cerr << "Notifying again...\n";
    }
    cv.notify_all();
}

int main()
{
    std::thread t1(waits, 1), t2(waits, 2), t3(waits, 3), t4(signals);
    t1.join(); 
    t2.join(); 
    t3.join();
    t4.join();
}

```

2. 虚假唤醒以及如何避免虚假唤醒:
   当线程从等待已发出信号的条件变量中醒来，却发现它等待的条件未得到满足时，就会发生虚假唤醒。发生虚假唤醒通常是因为在发出条件变量信号和等待线程最终运行之间，另一个线程运行并更改了条件，导致 `wait` 的线程被唤醒后，实际条件却未满足。比如我们在 `notify_all()` 时多个线程都被唤醒，但此时实际共享区却只有少数几个线程可以操作，这时就会造成其他线程被虚假唤醒，可以在 `wait` 唤醒后再次进行检测 `condition` 解决虚假唤醒。

* 虚假唤醒导致的后果：之前要等待的某个条件实际上并没有符合，被唤醒的线程将可能会执行一系列非法操作。
* 通常的解决办法：在条件变量阻塞的代码处增加一个 `while` 循环，如果被唤醒就要检查一下条件是否符合，如果不符合则要再次进入阻塞等待。这样即避免了忙等待，又避免了虚假唤醒问题。

```
lock(mutex);
while( something not true ) {  
    condition_wait( cond, mutex);
}
do(something);
unlock(mutex);

```

参考资料：

* [condition_variable](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/thread/condition_variable)
* [使用条件变量condition_variable, 什么条件下会虚假唤醒？](https://leetcode.cn/link/?target=https://segmentfault.com/q/1010000010421523)
* [C++ Threading #6: Condition Variable](https://leetcode.cn/link/?target=https://www.youtube.com/watch?v=13dFggo4t_I&list=PL5jc9xFGsL8E12so1wlMS0r0hTQoJL74M&index=6)
* [Spurious wakeup](https://leetcode.cn/link/?target=https://en.m.wikipedia.org/wiki/Spurious_wakeup)
* [为什么条件锁会产生虚假唤醒现象（spurious wakeup）？](https://leetcode.cn/link/?target=https://www.zhihu.com/question/271521213)
* [C语言中pthread_cond_wait 详解](https://leetcode.cn/link/?target=https://blog.csdn.net/qq_39852676/article/details/121368186)


#### 02. 线程同步与异步 5

面试高频指数：★★★★★

线程同步操作：
`C++` 标准库提供了以下几种线程同步的方式:

* 互斥量（支持超时加锁、递归加锁）；
* 读写锁（共享互斥量，也支持超时加锁）；
* 互斥量包装器（基于 `RAII` 的思想）；
* 条件变量；
* 信号量（二元信号量、计数信号量）；
* `barrier`；
* `call_once`；

不同的同步方式具有不同的使用场景和性能，实际使用时根据不同的场景选择不同的同步方式，分别就几种以上几种方式进行简要介绍:

1. 互斥量（`mutex`）：
   互斥量（`mutex`）是防止同时访问共享资源的程序对象。为避免线程更新共享变量时所出现问题，必须使用互斥量（`mutex` 是 `mutual exclusion` 的缩写）来确保同时仅有一个线程可以访问某项共享资源。 即使用互斥量来实现原子访问操作，防止多个线程对临界区同时操作而产生不一致的问题。`mutex` 只有锁定（`locked`）和未锁定（`unlocked`）两种状态。任何时候，至多只有一个线程可以锁定互斥量。试图对已经锁定的互斥量再次加锁，将可能阻塞线程或者报错失败，`mutex` 的底层可能封装的是操作系统 `spinlock`，不同的操作系统下可能有不同的实现。`C++` 中关于 `mutex` 的头文件为 `#include <mutex>`。

```
#include <iostream>   
#include <thread>  
#include <mutex>  

std::mutex mtx;   

void print_block (int n, char c) {
  mtx.lock();
  for (int i=0; i<n; ++i) { std::cout << c; }
  std::cout << '\n';
  mtx.unlock();
}

int main ()
{
  std::thread th1 (print_block,50,'*');
  std::thread th2 (print_block,50,'$');

  th1.join();
  th2.join();

  return 0;
}
/*
****************************************
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
*/

```

`C++` 中还定义了 `timed_mutex`：在 `mutex` 的基础上增加了超时加锁的功能。
`recursive_mutex`：在 `mutex` 的基础上增加了递归加锁的功能（此时，`lock()` 函数可以被同一线程在不释放锁的情况下多次调用）。

```
std::recursive_mutex mtx;

void fun1() {
    mtx.lock();
    mtx.unlock();
}

void fun2() {
    mtx.lock();
    fun1(); // recursive lock 
    mtx.unlock();
};

```


2. 共享互斥量:
   `std::shared_mutex` 是 `C++ 17` 标准中引入的，由 `unique_lock` 和 `shared_lock` 两个类模板配合 `shared_mutex` 使用，主要用于读写共享锁。`unique_lock` 用于写入时加锁，`shared_lock` 用于读取时加锁。对象在构造时自动对 `std::shared_mutex` 加锁，析构时自动对其解锁。头文件主要包含在 `#include <shared_mutex>`。`shared_mutex` 可用于保护共享数据不被多个线程同时访问。与其他便于独占访问的互斥锁类型相比，`shared_mutex` 具有两个访问级别：

* `shared`：多个线程可以共享同一个互斥锁的所有权。
* `exclusive<span> </span>`：只有一个线程可以拥有互斥锁。
  共享互斥锁通常用于多个读取操作可以同时访问同一资源而不会导致数据竞争，但只有一个写入操作的场景。

```
#include <iostream>
#include <mutex>  // For std::unique_lock
#include <shared_mutex>
#include <thread>
 
class ThreadSafeCounter {
 public:
  ThreadSafeCounter() = default;
 
  // 多个线程可以同时读取 countter 计数
  unsigned int get() const {
    std::shared_lock lock(mutex_);
    return value_;
  }
 
  // 只有1个线程可以修改 countter 计数
  void increment() {
    std::unique_lock lock(mutex_);
    value_++;
  }
 
  // 只有1个线程可以修改 countter 计数
  void reset() {
    std::unique_lock lock(mutex_);
    value_ = 0;
  }
 
 private:
  mutable std::shared_mutex mutex_;
  unsigned int value_ = 0;
};
 
int main() {
  ThreadSafeCounter counter;
 
  auto increment_and_print = [&counter]() {
    for (int i = 0; i < 3; i++) {
      counter.increment();
      std::cout << std::this_thread::get_id() << ' ' << counter.get() << '\n';
 
      // Note: Writing to std::cout actually needs to be synchronized as well
      // by another std::mutex. This has been omitted to keep the example small.
    }
  };
 
  std::thread thread1(increment_and_print);
  std::thread thread2(increment_and_print);
 
  thread1.join();
  thread2.join();
}
/*
139677317637888 2
139677317637888 3
139677309245184 4
139677309245184 5
139677309245184 6
139677317637888 6
*/


```


我们可以看到 `increment` 同时只能有一个线程对计数进行增加，但可能同时存在多个线程读取同一个计数。
`shared_timed_mutex` 是在 `shared_mutex` 的基础上增加了超时加锁的功能。

3. 互斥量包装器
   `lock_guard`：使用了 `RAII` 的机制对互斥量进行类模板封装，构造时加锁，析构时解锁。

```
#include <mutex>
std::mutex mtx;
void f()
{
  const std::lock_guard<std::mutex> lock(mtx);
  // ...
  // mtx is automatically released when lock goes out of scope
}

```


互斥量包装器对比原生的 `mutex` 来说，创建即加锁，作用域结束自动析构并解锁，无需手动解锁。缺点是不能中途解锁，不支持复制和移动。在需要加锁的地方，只需要任意实例化一个 `lock_guard`，调用构造函数成功上锁，出作用域时则 `lock_guard` 对象会被销毁，调用析构函数自动解锁可以有效避免死锁问题，但是提供的功能单一且不够灵活。

`unique_lock`：`unique_lock` 类模板也是采用 `RAII` 的方式对锁进行了封装，并且也是以独占所有权的方式管理 `mutex` 对象的上锁和解锁操作，即其对象之间不能发生拷贝。在构造（或移动 `move` 赋值）时，`unique_lock` 对象需要传递一个 `mutex` 对象作为它的参数，新创建的 `unique_lock` 对象负责传入的 `mutex` 对象的上锁和解锁操作。使用以上类型互斥量实例化 `unique_lock` 的对象时，自动调用构造函数上锁，`unique_lock` 对象销毁时自动调用析构函数解锁，可以很方便的防止死锁问题。与 `lock_guard` 不同的是，`unique_lock` 更加的灵活，提供了更多的成员函数：

* 上锁/解锁操作：`lock`、`try_lock`、`try_lock_for`、`try_lock_until` 和 `unlock`；
* 修改操作：支持移动赋值、交换（`swap`：与另一个 `unique_lock` 对象互换所管理的互斥量所有权）、释放（`release`：返回它所管理的互斥量对象的指针，并释放所有权）。
* 获取属性：`owns_lock` （返回当前对象是否上了锁）、`operator bool()` （与 `owns_lock()` 的功能相同）、`mutex`（返回当前 `unique_lock` 所管理的互斥量的指针）。

4. 条件变量（`condition variable`）：
   在 `C++ 11` 以后，我们可以使用条件变量（`condition_variable`）实现多个线程间的同步操作；当条件不满足时，相关线程被一直阻塞，直到某种条件出现，这些线程才会被唤醒。`C++` 中包含的头文件在 `#include <condition_variable>` 中。
   条件变量是利用线程间共享的全局变量进行同步的一种机制，主要包括两个动作：

* 一个线程因等待 `条件变量的条件成立` 而挂起；
* 另外一个线程使 `条件成立` 从而给出唤醒线程的信号，从而唤醒被等待的线程；
  为了防止竞争，条件变量的使用总是和一个互斥锁结合在一起；通常情况下这个锁是 `std::mutex`，并且管理这个锁只能是 `std::unique_lock std::mutex` 等 `RAII` 模板类。分别是使用以下两个方法实现：
* 等待条件成立使用的是 `condition_variable` 类成员 `wait` 、`wait_for` 或 `wait_until`。
* 唤醒信号使用的是 `condition_variable` 类成员 `notify_one` 或者 `notify_all` 函数。
  我们可以看到 `wait` 函数如下：

```
template< class Predicate >
void wait( std::unique_lock<std::mutex>& lock, Predicate stop_waiting );

```


线程会一直挂起，直到 `stop_waiting` 为 `true` 为止。程序示例如下:

```
#include <iostream>
#include <string>
#include <thread>
#include <mutex>
#include <condition_variable>
 
std::mutex m;
std::condition_variable cv;
std::string data;
bool ready = false;
bool processed = false;
 
void worker_thread()
{
    std::unique_lock<std::mutex> lk(m);
    // worker 线程等待 ready
    cv.wait(lk, []{return ready;});
 
    // 唤醒执行
    std::cout << "Worker thread is processing data\n";
    data += " after processing";
 
    // processed 设置为 true, 唤醒 main 线程
    processed = true;
    std::cout << "Worker thread signals data processing completed\n";
 
    // 释放锁，防止再次被唤醒。
    lk.unlock();
    // 唤醒 main 线程
    cv.notify_one();
}
 
int main()
{
    std::thread worker(worker_thread);
    // 让 worker 线程先执行，再进行唤醒，否则可能出现 ready = true 先于 worker 线程的执行
    worker.detach();
  
    data = "Example data";
    // 设置 ready 为 true, 唤醒 worker 线程
    {
        std::lock_guard<std::mutex> lk(m);
        ready = true;
        std::cout << "main() signals data ready for processing\n";
    }
    // 唤醒 worker 线程
    cv.notify_one();
    // 等待 worker 线程
    {
        std::unique_lock<std::mutex> lk(m);
        cv.wait(lk, []{return processed;});
    }
    std::cout << "Back in main(), data = " << data << '\n';
    return 0;
}

```


5. 信号量：
   `C++ 20` 中添加了 `C++` 中的信号量为二元信号量与计数信号量，二元信号量实际为计数信号量模板的特化。
   * `binary_semaphore`：二元信号量类似于互斥量，信号量只有 `0` 与 `1` 。
   * `counting_semaphore`：计数信号量
     所有关于信号量的定义参考头文件 `#include <semaphore>`，计数信号量是一种轻量级同步原语，可以控制对共享资源的访问。与 `std::mutex` 不同的是，`acounting_semaphore` 至少允许 `LeastMaxValue` 并发访问者对同一资源进行多个并发访问。`Acounting_semaphore` 包含一个由构造函数初始化的内部计数器。该计数器可以通过 `acquire()` 获取资源访问权限，并通过调用 `release()` 来释放资源从而递增计数器。当计数器为零时，调用 `acquire()` 时就会阻塞直到计数器增加，但是调用 `try_acquire( )` 不阻塞；`try_acquire_for()` 和 `try_acquire_until()` 阻塞直到计数器增加或达到超时。

```
#include <iostream>
#include <thread>
#include <chrono>
#include <semaphore>
 
std::binary_semaphore
	smphSignalMainToThread{0},
	smphSignalThreadToMain{0};
 
void ThreadProc()
{
    // 第一次进入阻塞
	smphSignalMainToThread.acquire();
	std::cout << "[thread] Got the signal\n"; // response message
	using namespace std::literals;
	std::this_thread::sleep_for(3s);
	std::cout << "[thread] Send the signal\n"; // message
    // 唤醒 main 线程
	smphSignalThreadToMain.release();
}
 
int main()
{
	std::thread thrWorker(ThreadProc);
	std::cout << "[main] Send the signal\n"; // message
    // 唤醒 ThreadProc 
	smphSignalMainToThread.release();
    // main 线程阻塞
	smphSignalThreadToMain.acquire();
	std::cout << "[main] Got the signal\n"; // response message
	thrWorker.join();
}
/*
[main] Send the signal
[thread] Got the signal
[thread] Send the signal
[main] Got the signal
*/

```

6. `barrier`:
   `C++ 20` 以后支持 `latch` 与 `barrier`，他们同样可以用来线程同步。

* `latch`：类 `latch` 是 `std::ptrdiff_t` 类型的向下计数器，可用于同步线程。计数器的值在创建时初始化。线程可能会阻塞在锁存器上，直到计数器减为零。不能增加或重置计数器，这使得锁存器创建后不可重用。其内部维护着一个计数器，当计数不为 `0` 时，所有参与者（线程）都将阻塞在等待操作处，计数为 `0` 时，解除阻塞。计数器不可重置或增加，故它是一次性的，不可重用。与 `std::barrier` 不同，`std::latch` 参与线程可以多次递减。

```
#include <latch>

std::latch work_done(4);

work_done.count_down();			 // decrements the counter in a non-blocking manner
work_done.wait();				   // blocks until the counter reaches zero
bool ok = work_done.try_wait();	 // tests if the internal counter equals zero
work_done.arrive_and_wait();	    // decrements the counter and blocks until it reaches zero


```


* `barrier`：类似于 `latch`，它会阻塞线程直到所有参与者线程都到达一个同步点，直到预期数量的线程到达设定的值则会接触阻塞。与 `latch` 不同的是，它是可重用的。
  一个 `barrier` 的生命周期包含多个阶段，每个阶段都定义了一个同步点。一个 `barrier` 阶段包含：
* 期望计数（设创建时指定的计数为 `n`），当期望计数不为 `0` 时，参与者将阻塞于等待操作处；
* 当期望计数为 `0` 时，会执行创建 `barrier` 时指定的阶段完成步骤，然后解除阻塞所有阻塞于同步点的参与者线程。
* 当阶段完成步骤执行完成后，会重置期望计数为 `n - 调用arrive_and_drop()` 的次数，然后开始下一个阶段。

```
#include <barrier>
#include <iostream>
#include <string>
#include <thread>
#include <vector>
 
int main() {
  const auto workers = { "anil", "busara", "carl" };
 
  auto on_completion = []() noexcept { 
    // locking not needed here
    static auto phase = "... done\n" "Cleaning up...\n";
    std::cout << phase;
    phase = "... done\n";
  };

  std::barrier sync_point(std::ssize(workers), on_completion);
  auto work = [&](std::string name) {
    std::string product = "  " + name + " worked\n";
    std::cout << product;  // ok, op<< call is atomic
    sync_point.arrive_and_wait();
    // 全部到达后，进行下一阶段
    product = "  " + name + " cleaned\n";
    std::cout << product;
    sync_point.arrive_and_wait();
  };
 
  std::cout << "Starting...\n";
  std::vector<std::thread> threads;
  for (auto const& worker : workers) {
    threads.emplace_back(work, worker);
  }
  for (auto& thread : threads) {
    thread.join();
  }
}
/*
Starting...
  anil worked
  carl worked
  busara worked
... done
Cleaning up...
  busara cleaned
  anil cleaned
  carl cleaned
... done
*/

```

7. `call_once`:
   `C++ 11` 以后支持 `call_once`。确保某个操作只被执行一次（成功执行才算），即使是多线程环境下也确保只执行一次。

```
template< class Callable, class... Args >
void call_once( std::once_flag& flag, Callable&& f, Args&&... args );


```

如果在 `call_once` 被调用时，`flag` 表明 `f` 已经被调用，则 `call_once` 立即返回（这种调用 `call_once` 称为被动）。

```
#include <iostream>
#include <thread>
#include <mutex>
 
std::once_flag flag1, flag2;
 
void simple_do_once()
{
    std::call_once(flag1, [](){ std::cout << "Simple example: called once\n"; });
}
 
int main()
{
    std::thread st1(simple_do_once);
    std::thread st2(simple_do_once);
    std::thread st3(simple_do_once);
    std::thread st4(simple_do_once);
    st1.join();
    st2.join();
    st3.join();
    st4.join();
}
/*
Simple example: called once
*/

```


参考资料：

* [mutex class (C++ Standard Library)](https://leetcode.cn/link/?target=https://docs.microsoft.com/en-us/cpp/standard-library/mutex-class-stl?view=msvc-170)
* [浅析mutex实现原理](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/390107537)
* [Mutex example / tutorial?](https://leetcode.cn/link/?target=https://stackoverflow.com/questions/4989451/mutex-example-tutorial)
* [C++11 并发指南三(std::mutex 详解)](https://leetcode.cn/link/?target=https://www.cnblogs.com/haippy/p/3237213.html)
* [C++ 并发编程（二）：Mutex（互斥锁）](https://leetcode.cn/link/?target=https://segmentfault.com/a/1190000006614695)
* [unique_lock详解](https://leetcode.cn/link/?target=https://blog.csdn.net/qq_37947660/article/details/120501119)
* [C++—线程同步](https://leetcode.cn/link/?target=https://segmentfault.com/a/1190000040628584?sort=newest)
* [std::counting_semaphore, std::binary_semaphore](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/thread/counting_semaphore)
* [std::call_once](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/thread/call_once)
* [std::call_once](https://leetcode.cn/link/?target=https://docs.w3cub.com/cpp/thread/call_once)


#### 03. C++ 互斥信号量 4

面试高频指数：★★★★☆

1. `std::thread`：
   我们可以通过 `thread` 创建一个线程（`C++ 11` 以后才支持 `thread` 标准库），`thread` 在构造相关线程对象完成后立即开始执行（实际需要等待 `OS` 对于线程的调度延迟）。`thread` 需要配合与 `join` 或者 `detach` 配合使用，不然可能出现不可预料的后果。

* `join` 代表阻塞当前主线程，等待当前的 `join` 的子线程完成后主线程才会继续；
* `detach` 表明当前子线程不阻塞主线程，且与主线程分离，子线程的运行不会影响到主线程。

```
#include <iostream>
#include <thread>
#include <string>
using namespace std;
void fn2(string st2) {
    cout<<st2<<endl;
}

void fn1(string st1) {
    cout<<st1<<endl;
}  

int main()
{
    thread thr1(fn1, "111111111\n"); 
    thread thr2(fn2, "222222222\n"); 
    return 0;
}

```


如在一个类中间，一个成员函数需要异步调用另一个函数的时候，需要绑定 `this`：

```
class Test{
    private:
    void func1(const std::string s1, int i) {
        std::cout << s1 << std::endl;
    }
    public:
    void func2() {
            std::thread t1(&Test::func1, this, "test", 0);
            t1.detach();
            std::cout << "func2" << std::endl;
    }

```


2. `std::async`:
   我们进行异步编程时，需要得到子进程的计算结果，常见的手段是我们可以通过共享变量或者消息队列的方式告知另一个线程当前的计算结果，但是操作和实现都比较麻烦，同时还要考虑线程间的互斥问题。`C++11` 中提供了一个相对简单的异步接口 `std::async`，通过这个接口可以简单地创建线程并通过 `std::future` 中获取结果，极大的方便了 `C++` 多线程编程。`std::async` 适合与需要取得结果的异步线程。`C++11` 中的 `std::async` 是个模板函数。`std::async` 异步调用函数，在某个时候以 `Args` 作为参数（可变长参数）调用函数，无需等待函数执行完成就可返回，返回结果是个 `std::future` 对象。函数返回的值可通过 `std::future` 对象的 `get` 成员函数获取。一旦完成函数的执行，共享状态将包含函数返回的值并 `ready`。

`async` 使用的函数原型和参数说明如下:

```
//(C++11 起) (C++17 前)
template< class Function, class... Args>
std::future<std::result_of_t<std::decay_t<Function>(std::decay_t<Args>...)>>
    async( Function&& f, Args&&... args );

//(C++11 起) (C++17 前)
template< class Function, class... Args >
std::future<std::result_of_t<std::decay_t<Function>(std::decay_t<Args>...)>>
    async( std::launch policy, Function&& f, Args&&... args );  

```


* 第一个参数是 `std::async` 的启动策略类型以下两种方式：`async` 允许调用者选择特定的启动策略:
  * `std::launch::async`：在调用 `async` 就开始创建线程，该函数由新线程异步调用，并且将其返回值与共享状态的访问点同步。
  * `std::launch::deferred`：延迟启动线程，在访问共享状态时该线程才启动。对函数的调用将推迟到返回的 `std::future` 的共享状态被访问时（即使用 `std::future` 的 `wait` 或 `get` 函数）。如果 `get` 或 `wait` 没有被调用，函数就绝对不会执行。
* 参数 `Function`：可以为函数指针、成员指针、任何类型的可移动构造的函数对象，也可以为匿名函数 `lambda`。`Function` 的返回值或异常存储在共享状态中以供异步的 `std::future` 对象检索。`std::future` 对象可以通过 `wait` 或 `get` 函数获取函数的返回值。
* 参数 `Args`：传递给函数 `Function` 调用的参数，它们的类型应是可移动构造的。
  我们可以用多线程将程序分为子任务，用子任务求解，程序示例如下:

```
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
#include <future>
#include <string>
#include <mutex>
  
template <typename RandomIt>
int parallel_sum(RandomIt beg, RandomIt end)
{
    auto len = end - beg;
    if (len < 1000)
        return std::accumulate(beg, end, 0);
 
    RandomIt mid = beg + len/2;
    auto handle = std::async(std::launch::async,
                             parallel_sum<RandomIt>, mid, end);
    int sum = parallel_sum(beg, mid);
    return sum + handle.get();
}

template <typename RandomIt>
int parallel_min(RandomIt beg, RandomIt end)
{
    auto len = end - beg;
    if (len < 1000)
        return *(std::min_element(beg, end));
 
    RandomIt mid = beg + len/2;
    auto handle = std::async(std::launch::async,
                             parallel_min<RandomIt>, mid, end);
    int ans = parallel_sum(beg, mid);
    return std::min(ans, handle.get());
}
 
int main()
{
    std::vector<int> v(10000, 1);
    std::cout << "The sum is " << parallel_sum(v.begin(), v.end()) << '\n';
    std::cout << "The min element is " << parallel_min(v.begin(), v.end()) << '\n';
} 

```

3. `std::future`:
   `std::future` 提供了一种访问线程异步操作结果的机制。从字面意思来看，`future` 表示未来，`std::async` 返回结果即为一个 `future`。在实际工程项目中，一个异步操作我们是不可能马上就获取操作结果的，只能在将来的某个时候获取，但是我们可以以同步等待的方式来获取结果，可以通过查询 `future` 的状态（`future_status`）来获取异步操作的结果。`future_status` 有三种状态：

* `deferred`：异步操作还没开始；
* `ready`：异步操作已经完成；
* `timeout`：异步操作超时；
  获取 `future` 结果有三种方式：`get`、`wait`、`wait_for`，其中 `get` 等待异步操作结束并返回结果，`wait` 只是等待异步操作完成，没有返回值，`wait_for` 是超时等待返回结果。

```
#include <iostream>
#include <future>
#include <thread>
 
int main()
{
    // future from an async()
    std::future<int> f1 = std::async(std::launch::async, []{ return 8; });
 
    // future from a promise
    std::promise<int> p;
    std::future<int> f2 = p.get_future();
    std::thread( [&p]{ p.set_value_at_thread_exit(9); }).detach();
 
    std::cout << "Waiting..." << std::flush;
    f1.wait();
    f2.wait();
    std::cout << "Done!\nResults are: "
              << f1.get() << ' ' << f2.get() << '\n';
}
/*
Waiting...Done!
Results are: 8 9
*/


```

参考资料：

* [C++中的异步编程](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/540239803)
* [C++ 多线程异步(std::async)](https://leetcode.cn/link/?target=https://blog.csdn.net/GreedySnaker/article/details/114300906)
* [join](https://leetcode.cn/link/?target=https://cplusplus.com/reference/thread/thread/join/)
* [std::async](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/thread/async)
* [std::async的使用总结](https://leetcode.cn/link/?target=https://segmentfault.com/a/1190000039083151)
* [C++ std::async 用法与范例](https://leetcode.cn/link/?target=https://shengyu7697.github.io/std-async/)
* [（原创）用C++11的std::async代替线程的创建](https://leetcode.cn/link/?target=https://www.cnblogs.com/leijiangtao/p/12076251.html)
* [std::async 的两个坑](https://leetcode.cn/link/?target=https://zhuanlan.zhihu.com/p/39757902)



#### 04. C++ I/O 操作 3

面试高频指数：★★★☆☆

`C++` 保持与 `C` 兼容，因此也保留支持 `printf` 和 `scanf` 进行输出和输人的方法。`c++` 具有面向对象的特性，引入了新的输入输出。`C++` 通过 `I/O` 类库来实现丰富的 `I/O` 功能。在 `C++` 中，输入和输出以字节序列或更通常称为 `stream` 的形式执行。

* 输入流（`inputstream`）：如果字节流的方向是从设备（例如键盘）到主存，那么这个过程称为输入。
* 输出流（`outputstream`）：如果字节流的方向相反，即从主存到设备（显示屏），那么这个过程称为输出。

![6_1_1.png](https://pic.leetcode-cn.com/1661515629-ypuTEg-6_1_1.png)

`C++` 采用了面向对象的思想对所有涉及 `I/O` 的操作进行了统一的封装，涉及到 `I/O` 操作的主要由 `<iostream>,<iomanip>,<fstream>` 三个头文件组成，`stream` 是其行为由类定义的对象，其中主要的类的继承关系如下图所示:

![6_1_2.png](https://pic.leetcode-cn.com/1661515645-WNnqbw-6_1_2.png)

* `C++` 中的 `Streams` 对象主要分为三种类型：
* `istream` ：这种类型的流对象只能从流中执行输入操作；
* `ostream` ：这些对象只能用于输出操作；
* `iostream` ：可用于输入和输出操作；


1. 标准输入输出:

* 标准输出流（`cout`）：通常标准输出设备是显示器。`C++ cout` 语句是 `ostream` 类的实例。它用于在标准输出设备上产生输出。需要在屏幕上显示的数据使用插入运算符（`<<`） 插入到标准输出流（`cout`）中。
* 标准输入流（`cin`）：通常计算机中的输入设备是键盘。`C++ cin` 语句是 `istream` 类的实例，用于从标准输入设备（通常是键盘）读取输入。 提取运算符 （`>>`） 与对象 `cin` 一起用于读取输入。提取运算符从使用键盘输入的对象 `cin` 中提取数据。

2. `I/O` 重定向：
   所有流对象都有一个关联的数据成员类 `streambuf`。简单地说，`streambuf` 对象就是流的缓冲区。当我们从流中读取数据时，我们不会直接从源中读取数据，而是从链接到源的缓冲区中读取数据。同样，输出操作首先在缓冲区上执行，然后在需要时刷新缓冲区（写入物理设备）。
   `C++` 允许我们为任何流设置流缓冲区，因此重定向流的任务简单地减少为更改与流关联的流缓冲区。因此，要将流 `A` 重定向到流 `B`，我们需要执行以下操作：

* 获取 `A` 的流缓冲区并将其存储在某处；
* 将 `A` 的流缓冲区设置为 `B` 的流缓冲区；
* 如果需要将 `A` 的流缓冲区重置为其先前的流缓冲区；
  我们可以使用函数 `ios::rdbuf()` 来执行以下两个操作:

```
stream_object.rdbuf()：//获取返回指向stream_object的流缓冲区的指针
stream_object.rdbuf(streambuf * p)：//将流缓冲区设置为p指向的


```

以下为程序示例:

```
// Cpp program to redirect cout to a file
#include <fstream>
#include <iostream>
#include <string>

using namespace std;

int main()
{
	fstream file;
	file.open("cout.txt", ios::out);
	string line;

	// 保存 cin 和 cout 的缓冲区 buffer
	streambuf* stream_buffer_cout = cout.rdbuf();
	streambuf* stream_buffer_cin = cin.rdbuf();

	// 获取文件 file 的缓冲区 buffer
	streambuf* stream_buffer_file = file.rdbuf();

	// cout 重定向文件
	cout.rdbuf(stream_buffer_file);
	cout << "This line written to file" << endl;

	// cout 恢复重定
	cout.rdbuf(stream_buffer_cout);
	cout << "This line is written to screen" << endl;

	file.close();
	return 0;
}

```


3. 在 `C/C++` 如何中清除输入缓冲区：
   所有标准输入和输出设备都包含一个输入和输出缓冲区。在标准 `C/C++` 中，流被缓冲。例如在标准输入的情况下，当我们按下键盘上的键时，它不会发送到您的程序，而是由操作系统发送到缓冲区，直到进程调度时才将其分配给该程序。
   在各种情况下，可能需要清除不需要的缓冲区，以便在所需的程序中立即获取下一个输入，而不是在前一个变量的缓冲区中。比如 `C` 遇到 `scanf()` 后，需要输入字符数组或字符，`C++` 遇到 `cin` 语句后，需要输入字符数组或字符。当我们从键盘获取一个字符串时，我们需要清除输入缓冲区，否则所需的输入被前一个变量的缓冲区占用。

```
#include<iostream>
#include<vector>
using namespace std;

int main()
{
    int a;
    char ch[80];
    cin >> a;
    cin.getline(ch,80);
    cout << a << endl;
    cout << ch << endl;
    return 0;
}

```


上述代码没有正确打印出字符串 `ch` 的值，原因是缓冲区被占用。`\n` 字符保留在缓冲区中，并作为下一个输入读取。因此我们在需要在输入 `ch` 之前，将缓冲区进行清除。

* 使用 `cin.ignore`：
  使用 `cin.ignore(numeric_limits::max(),'\n');` ”，在 `cin` 语句之后丢弃输入流中的所有内容，包括换行符。

```
#include<iostream>
#include<ios> //used to get stream size
#include<limits> //used to get numeric limits
using namespace std;

int main()
{
    int a;
    char ch[80];
    cin >> a;
    cin.ignore(numeric_limits<streamsize>::max(),'\n');
    cin.getline(ch,80);
    cout << a << endl;
    cout << ch << endl;
    return 0;
}
/*
4 
C++
*/

```


* 使用 `cin>>ws`：
  在 `cin` 语句之后输入 `cin>>ws` 告诉编译器忽略缓冲区并丢弃字符串或字符数组实际内容之前的所有空格。

```
#include<iostream>
#include<ios> //used to get stream size
#include<limits> //used to get numeric limits
using namespace std;

int main()
{
    int a;
    char ch[80];
    cin >> a;
    cin.ignore(numeric_limits<streamsize>::max(),'\n');
    cin.getline(ch,80);
    cout << a << endl;
    cout << ch << endl;
    return 0;
}

```


参考资料：

* [C++中的IO操作](https://leetcode.cn/link/?target=https://blog.csdn.net/a1912157861/article/details/122324514)
* [Clearing The Input Buffer In C/C++](https://leetcode.cn/link/?target=https://www.***.org/clearing-the-input-buffer-in-cc/)
* [Basic Input / Output in C++](https://leetcode.cn/link/?target=https://www.***.org/basic-input-output-c/)
* [C++ Basic Input/Output](https://leetcode.cn/link/?target=https://www.tutorialspoint.com/cplusplus/cpp_basic_input_output.htm)
* [Input/output library](https://leetcode.cn/link/?target=https://en.cppreference.com/w/cpp/io)
* [C++ Programming Language Stream IO and File IO](https://leetcode.cn/link/?target=https://www3.ntu.edu.sg/home/ehchua/programming/cpp/cp10_io.html)
