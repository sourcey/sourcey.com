# Module <!-- group --> `thread`



## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`namespace `[`scy`](#namespacescy)    | 
# namespace `scy` {#namespacescy}



## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`class `[`scy::Mutex`](#classscy_1_1Mutex)    | 
`class `[`scy::ScopedLock`](#classscy_1_1ScopedLock)    | 
# class `scy::Mutex` {#classscy_1_1Mutex}




This class is a wrapper around uv_mutex_t.

A [Mutex](#classscy_1_1Mutex) (mutual exclusion) is a synchronization mechanism used to control access to a shared resource in a concurrent (multithreaded) scenario.

The [ScopedLock](#classscy_1_1ScopedLock) class is usually used to obtain a [Mutex](#classscy_1_1Mutex) lock, since it makes locking exception-safe.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public  Mutex()` | 
`public  ~Mutex()` | 
`public void lock()` | 
`public bool tryLock()` | 
`public void unlock()` | 

## Members

#### `public  Mutex()` {#group__thread_1gaa505afade5fc6228c6a216ce4f8d750d}





#### `public  ~Mutex()` {#group__thread_1ga3fc093fe6b2e41a1b22028c5f730a419}





#### `public void lock()` {#group__thread_1gad2e904ac86fe7a3a369fb1f74e2068f7}



Locks the mutex. Blocks if the mutex is held by another thread.

#### `public bool tryLock()` {#group__thread_1gaff9cac1980829d00d00e52a8a1e68e84}



Tries to lock the mutex. Returns false if the mutex is already held by another thread. Returns true if the mutex was successfully locked.

#### `public void unlock()` {#group__thread_1ga2791e24445092c0ded771c148b6ee4b5}



Unlocks the mutex so that it can be acquired by other threads.

# class `scy::ScopedLock` {#classscy_1_1ScopedLock}




[ScopedLock](#classscy_1_1ScopedLock) simplifies thread synchronization with a [Mutex](#classscy_1_1Mutex) or similar lockable object. The given [Mutex](#classscy_1_1Mutex) is locked in the constructor, and unlocked it in the destructor. T can be any class with lock() and unlock() functions.

## Summary

 Members                        | Descriptions                                
--------------------------------|---------------------------------------------
`public inline  explicit ScopedLock(T & m)` | 
`public inline  ~ScopedLock()` | 

## Members

#### `public inline  explicit ScopedLock(T & m)` {#group__thread_1gaec7c41fcc3e238b4c5c7bc58cf409498}





#### `public inline  ~ScopedLock()` {#group__thread_1ga93e842e5274e111fa60d77c0ce8ab3d1}





