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
