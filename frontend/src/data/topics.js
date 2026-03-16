export const categories = [
  { id: 'cpp11-syntax', name: 'C++11 語法', icon: 'Code', color: '#00d4ff' },
  { id: 'cpp14-17-20', name: 'C++14/17/20', icon: 'Layers', color: '#a855f7' },
  { id: 'best-practices', name: 'Best Practices', icon: 'Shield', color: '#22c55e' },
  { id: 'design-patterns', name: 'Design Patterns', icon: 'Settings', color: '#f59e0b' },
  { id: 'system-programming', name: '系統程式設計', icon: 'Cpu', color: '#ef4444' },
];

export const topics = [
  // ===== C++11 SYNTAX =====
  {
    id: 'auto-and-decltype',
    category: 'cpp11-syntax',
    title: 'auto 與 decltype 型別推導',
    description: '學習 C++11 引入的自動型別推導機制，讓編譯器幫你決定變數型別。',
    difficulty: 'beginner',
    content: `# auto 與 decltype 型別推導

## 為什麼需要型別推導？

在 C++11 之前，我們必須明確寫出每個變數的型別。當型別變得複雜時（例如迭代器），程式碼會變得冗長且難以閱讀。

## auto 關鍵字

\`auto\` 讓編譯器根據初始化表達式自動推導變數的型別：

\`\`\`cpp
auto x = 42;           // int
auto pi = 3.14;        // double
auto name = std::string("C++"); // std::string
auto it = vec.begin(); // std::vector<int>::iterator
\`\`\`

### auto 的推導規則

1. **會忽略頂層 const 和引用**：
\`\`\`cpp
const int ci = 42;
auto a = ci;     // int（忽略 const）
auto& b = ci;    // const int&（引用保留 const）
\`\`\`

2. **搭配 & 和 * 使用**：
\`\`\`cpp
auto& ref = x;   // int&
const auto& cref = x; // const int&
auto* ptr = &x;  // int*
\`\`\`

## decltype 關鍵字

\`decltype\` 用於查詢表達式的型別，而不進行求值：

\`\`\`cpp
int x = 42;
decltype(x) y = 10;        // int
decltype(x + 1.0) z = 3.14; // double
\`\`\`

### decltype 與 auto 的差異

- \`auto\` 會忽略頂層 const 和引用
- \`decltype\` 完整保留表達式的型別

## 常見陷阱

- 不要對未初始化的變數使用 \`auto\`
- \`auto\` 會拷貝物件，需要引用時記得加 \`&\`
- \`decltype((x))\` 與 \`decltype(x)\` 結果不同（加括號會變成引用）

## Best Practice

- 當型別明顯時使用 \`auto\` 提高可讀性
- 複雜的模板型別優先使用 \`auto\`
- 需要精確型別控制時使用 \`decltype\`
`,
    codeExample: `#include <iostream>
#include <vector>
#include <map>
#include <string>

int main() {
    // auto 基本用法
    auto x = 42;
    auto pi = 3.14;
    auto greeting = std::string("Hello, Modern C++!");

    std::cout << "x = " << x << " (int)" << std::endl;
    std::cout << "pi = " << pi << " (double)" << std::endl;
    std::cout << "greeting = " << greeting << std::endl;

    // auto 搭配容器
    std::vector<int> nums = {1, 2, 3, 4, 5};
    std::map<std::string, int> ages = {{"Alice", 30}, {"Bob", 25}};

    // 傳統寫法 vs auto
    // std::vector<int>::iterator it = nums.begin();
    auto it = nums.begin();
    std::cout << "First element: " << *it << std::endl;

    // auto 搭配 range-based for
    std::cout << "Numbers: ";
    for (const auto& n : nums) {
        std::cout << n << " ";
    }
    std::cout << std::endl;

    // decltype 用法
    decltype(x) y = 100;  // int
    decltype(pi) e = 2.718; // double
    std::cout << "y = " << y << ", e = " << e << std::endl;

    // decltype 用於函式返回型別
    auto add = [](int a, int b) -> decltype(a + b) {
        return a + b;
    };
    std::cout << "3 + 4 = " << add(3, 4) << std::endl;

    return 0;
}`,
    exercise: {
      title: '型別推導練習',
      description: '使用 auto 和 decltype 完成以下程式。程式需要：\n1. 建立一個 vector<pair<string, int>> 儲存學生姓名和成績\n2. 使用 auto 遍歷並找出最高分\n3. 使用 decltype 宣告結果變數\n4. 輸出最高分學生的姓名和成績',
      starterCode: `#include <iostream>
#include <vector>
#include <string>
#include <utility>

int main() {
    // TODO: 建立學生資料
    // 格式: {{"Alice", 85}, {"Bob", 92}, {"Charlie", 78}, {"Diana", 95}}

    // TODO: 使用 auto 遍歷找出最高分學生

    // TODO: 輸出結果，格式: "Best: <name> <score>"

    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: 'Best: Diana 95' }
      ],
      hints: [
        '使用 std::vector<std::pair<std::string, int>> 儲存資料',
        '用 auto& 來避免不必要的拷貝',
        '可以用 auto best = students[0] 初始化最佳學生'
      ]
    }
  },
  {
    id: 'range-based-for',
    category: 'cpp11-syntax',
    title: 'Range-based for 迴圈',
    description: '更簡潔、更安全的容器遍歷方式，告別傳統的索引迴圈。',
    difficulty: 'beginner',
    content: `# Range-based for 迴圈

## 語法

\`\`\`cpp
for (declaration : expression) {
    statement;
}
\`\`\`

## 三種使用方式

1. **值拷貝** - 修改不影響原容器：
\`\`\`cpp
for (auto val : vec) { ... }
\`\`\`

2. **const 引用** - 唯讀，最常用：
\`\`\`cpp
for (const auto& val : vec) { ... }
\`\`\`

3. **引用** - 可修改原容器元素：
\`\`\`cpp
for (auto& val : vec) { val *= 2; }
\`\`\`

## 適用範圍

- STL 容器（vector, list, map, set...）
- C 風格陣列
- std::initializer_list
- 任何提供 begin()/end() 的物件

## Best Practice

- 唯讀遍歷用 \`const auto&\`
- 需要修改元素用 \`auto&\`
- 避免用值拷貝（除非型別很小如 int）
`,
    codeExample: `#include <iostream>
#include <vector>
#include <map>
#include <string>

int main() {
    // 基本用法
    std::vector<int> nums = {1, 2, 3, 4, 5};

    std::cout << "Original: ";
    for (const auto& n : nums) {
        std::cout << n << " ";
    }
    std::cout << std::endl;

    // 修改元素
    for (auto& n : nums) {
        n *= 2;
    }

    std::cout << "Doubled: ";
    for (const auto& n : nums) {
        std::cout << n << " ";
    }
    std::cout << std::endl;

    // 遍歷 map
    std::map<std::string, int> scores = {
        {"Math", 95}, {"English", 87}, {"Science", 92}
    };

    for (const auto& [subject, score] : scores) {
        std::cout << subject << ": " << score << std::endl;
    }

    // C 風格陣列
    int arr[] = {10, 20, 30};
    int sum = 0;
    for (const auto& val : arr) {
        sum += val;
    }
    std::cout << "Sum: " << sum << std::endl;

    return 0;
}`,
    exercise: {
      title: 'Range-based for 練習',
      description: '使用 range-based for 迴圈完成：\n1. 讀取 N 個整數\n2. 將所有奇數加倍\n3. 計算修改後的總和並輸出',
      starterCode: `#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;

    std::vector<int> nums(n);
    for (auto& x : nums) {
        std::cin >> x;
    }

    // TODO: 使用 range-based for 將所有奇數加倍

    // TODO: 計算並輸出總和

    return 0;
}`,
      testCases: [
        { input: '5\n1 2 3 4 5', expectedOutput: '27' },
        { input: '3\n2 4 6', expectedOutput: '12' }
      ],
      hints: [
        '用 auto& 才能修改原始值',
        '判斷奇數: x % 2 != 0',
        '可以用另一個 range-based for 搭配 const auto& 來加總'
      ]
    }
  },
  {
    id: 'lambda-expressions',
    category: 'cpp11-syntax',
    title: 'Lambda 表達式',
    description: '匿名函式讓你就地定義函式物件，是現代 C++ 最強大的特性之一。',
    difficulty: 'intermediate',
    content: `# Lambda 表達式

## 語法

\`\`\`cpp
[capture](parameters) -> return_type { body }
\`\`\`

## 捕獲列表 (Capture)

- \`[]\` - 不捕獲任何變數
- \`[=]\` - 以值捕獲所有變數
- \`[&]\` - 以引用捕獲所有變數
- \`[x]\` - 以值捕獲 x
- \`[&x]\` - 以引用捕獲 x
- \`[=, &x]\` - 全部以值捕獲，x 以引用捕獲
- \`[this]\` - 捕獲 this 指標

## 搭配 STL 演算法

Lambda 最常用於 STL 演算法中：

\`\`\`cpp
std::sort(vec.begin(), vec.end(), 
    [](int a, int b) { return a > b; }); // 降序排列
\`\`\`

## C++14: 泛型 Lambda

\`\`\`cpp
auto print = [](const auto& x) { std::cout << x; };
\`\`\`

## C++14: init capture

\`\`\`cpp
auto ptr = std::make_unique<int>(42);
auto lambda = [p = std::move(ptr)]() { return *p; };
\`\`\`

## Best Practice

- 短小的回呼函式用 lambda
- 需要重複使用的邏輯抽成具名函式
- 預設以 \`[&]\` 捕獲時要注意生命週期
`,
    codeExample: `#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
#include <string>

int main() {
    // 基本 lambda
    auto greet = []() { std::cout << "Hello, Lambda!" << std::endl; };
    greet();

    // 帶參數的 lambda
    auto add = [](int a, int b) { return a + b; };
    std::cout << "3 + 5 = " << add(3, 5) << std::endl;

    // 捕獲外部變數
    int factor = 3;
    auto multiply = [factor](int x) { return x * factor; };
    std::cout << "7 * 3 = " << multiply(7) << std::endl;

    // 搭配 STL 演算法
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};

    // 排序（降序）
    std::sort(nums.begin(), nums.end(),
        [](int a, int b) { return a > b; });

    std::cout << "Sorted (desc): ";
    for (const auto& n : nums) std::cout << n << " ";
    std::cout << std::endl;

    // find_if
    auto it = std::find_if(nums.begin(), nums.end(),
        [](int x) { return x < 5; });
    if (it != nums.end()) {
        std::cout << "First < 5: " << *it << std::endl;
    }

    // 以引用捕獲並修改
    int count = 0;
    std::for_each(nums.begin(), nums.end(),
        [&count](int x) { if (x > 3) count++; });
    std::cout << "Count > 3: " << count << std::endl;

    // 泛型 lambda (C++14)
    auto print = [](const auto& container) {
        for (const auto& elem : container)
            std::cout << elem << " ";
        std::cout << std::endl;
    };

    std::vector<std::string> words = {"Modern", "C++", "Lambda"};
    print(words);

    return 0;
}`,
    exercise: {
      title: 'Lambda 表達式練習',
      description: '使用 lambda 完成以下任務：\n1. 讀取 N 個整數\n2. 使用 std::sort 搭配 lambda 按絕對值排序\n3. 使用 std::count_if 搭配 lambda 計算正數個數\n4. 輸出排序結果和正數個數',
      starterCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> nums(n);
    for (auto& x : nums) std::cin >> x;

    // TODO: 用 lambda 按絕對值大小排序（小到大）

    // TODO: 用 lambda 搭配 count_if 計算正數個數

    // TODO: 輸出排序結果（空格分隔），換行後輸出正數個數

    return 0;
}`,
      testCases: [
        { input: '5\n-3 1 -5 2 4', expectedOutput: '1 2 -3 4 -5\n3' },
        { input: '4\n-1 -2 3 -4', expectedOutput: '-1 -2 3 -4\n1' }
      ],
      hints: [
        'std::sort 的比較函式: [](int a, int b) { return std::abs(a) < std::abs(b); }',
        'std::count_if 回傳滿足條件的元素數量',
        '正數條件: x > 0'
      ]
    }
  },
  {
    id: 'smart-pointers',
    category: 'cpp11-syntax',
    title: '智慧指標',
    description: '使用 unique_ptr、shared_ptr、weak_ptr 實現自動記憶體管理，告別 new/delete。',
    difficulty: 'intermediate',
    content: `# 智慧指標 (Smart Pointers)

## 為什麼需要智慧指標？

裸指標 (raw pointer) 的問題：
- 忘記 delete 導致記憶體洩漏
- 重複 delete 導致未定義行為
- 異常安全問題

## std::unique_ptr

**獨佔所有權**的智慧指標，不可複製但可移動：

\`\`\`cpp
auto ptr = std::make_unique<int>(42);
auto ptr2 = std::move(ptr); // 所有權轉移
\`\`\`

## std::shared_ptr

**共享所有權**的智慧指標，使用引用計數：

\`\`\`cpp
auto sp1 = std::make_shared<int>(42);
auto sp2 = sp1; // 引用計數 +1
\`\`\`

## std::weak_ptr

不增加引用計數，解決 shared_ptr 的循環引用問題：

\`\`\`cpp
std::weak_ptr<int> wp = sp1;
if (auto locked = wp.lock()) { /* 使用 locked */ }
\`\`\`

## Best Practice

- 優先使用 \`make_unique\` 和 \`make_shared\`
- 預設使用 \`unique_ptr\`，需要共享時才用 \`shared_ptr\`
- 函式參數傳遞：用 raw pointer 或 reference（不轉移所有權時）
- 永遠不要用 \`new\`/\`delete\`
`,
    codeExample: `#include <iostream>
#include <memory>
#include <string>
#include <vector>

class Resource {
    std::string name_;
public:
    Resource(const std::string& name) : name_(name) {
        std::cout << "Resource '" << name_ << "' created" << std::endl;
    }
    ~Resource() {
        std::cout << "Resource '" << name_ << "' destroyed" << std::endl;
    }
    void use() const { std::cout << "Using '" << name_ << "'" << std::endl; }
};

int main() {
    // unique_ptr - 獨佔所有權
    {
        auto res = std::make_unique<Resource>("Unique");
        res->use();
        // auto copy = res; // 編譯錯誤！不可複製
        auto moved = std::move(res); // 所有權轉移
        moved->use();
    } // moved 離開作用域，自動釋放

    std::cout << "---" << std::endl;

    // shared_ptr - 共享所有權
    {
        auto sp1 = std::make_shared<Resource>("Shared");
        std::cout << "Count: " << sp1.use_count() << std::endl;
        {
            auto sp2 = sp1;
            std::cout << "Count: " << sp1.use_count() << std::endl;
            sp2->use();
        }
        std::cout << "Count: " << sp1.use_count() << std::endl;
    }

    std::cout << "---" << std::endl;

    // unique_ptr 與容器
    std::vector<std::unique_ptr<Resource>> resources;
    resources.push_back(std::make_unique<Resource>("R1"));
    resources.push_back(std::make_unique<Resource>("R2"));

    for (const auto& r : resources) {
        r->use();
    }

    return 0;
}`,
    exercise: {
      title: '智慧指標練習',
      description: '實作一個簡單的物件池 (Object Pool)：\n1. 建立一個 Widget 類別，建構時印出 "Widget N created"，解構時印出 "Widget N destroyed"\n2. 使用 shared_ptr 管理 Widget\n3. 建立 3 個 Widget 並存入 vector\n4. 印出每個 Widget 的引用計數\n5. 清空 vector 觀察自動銷毀',
      starterCode: `#include <iostream>
#include <memory>
#include <vector>

class Widget {
    int id_;
public:
    Widget(int id) : id_(id) {
        std::cout << "Widget " << id_ << " created" << std::endl;
    }
    ~Widget() {
        std::cout << "Widget " << id_ << " destroyed" << std::endl;
    }
    int id() const { return id_; }
};

int main() {
    // TODO: 建立 vector<shared_ptr<Widget>>
    // TODO: 用 make_shared 建立 3 個 Widget (id: 1, 2, 3)
    // TODO: 輸出每個 widget 的 use_count
    // TODO: 清空 vector

    std::cout << "Done" << std::endl;
    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: 'Widget 1 created\nWidget 2 created\nWidget 3 created\nWidget 1 count: 1\nWidget 2 count: 1\nWidget 3 count: 1\nWidget 1 destroyed\nWidget 2 destroyed\nWidget 3 destroyed\nDone' }
      ],
      hints: [
        '使用 std::make_shared<Widget>(id) 建立',
        'sp.use_count() 取得引用計數',
        'vector.clear() 清空容器'
      ]
    }
  },
  {
    id: 'move-semantics',
    category: 'cpp11-syntax',
    title: '移動語意與右值參考',
    description: '理解 C++11 最重要的效能優化特性：移動語意、右值參考、std::move。',
    difficulty: 'advanced',
    content: `# 移動語意與右值參考

## 左值 vs 右值

- **左值 (lvalue)**：有名稱、可取址的表達式，如變數
- **右值 (rvalue)**：臨時值、字面量，即將被銷毀的物件

## 右值參考 (&&)

\`\`\`cpp
int&& rref = 42;          // 右值參考
std::string&& s = "temp"; // 綁定到臨時值
\`\`\`

## 移動建構與移動賦值

\`\`\`cpp
class MyClass {
    MyClass(MyClass&& other) noexcept;            // 移動建構
    MyClass& operator=(MyClass&& other) noexcept; // 移動賦值
};
\`\`\`

## std::move

將左值轉換為右值參考，啟用移動語意：

\`\`\`cpp
std::string s1 = "hello";
std::string s2 = std::move(s1); // s1 被「掏空」
\`\`\`

## Rule of Five

如果你定義了以下任一個，通常需要全部定義：
1. 解構函式
2. 拷貝建構
3. 拷貝賦值
4. 移動建構
5. 移動賦值

## Best Practice

- 移動操作標記為 \`noexcept\`
- 移動後的物件應處於有效但未指定的狀態
- 不要對 const 物件使用 std::move（無效果）
`,
    codeExample: `#include <iostream>
#include <string>
#include <vector>
#include <utility>

class Buffer {
    int* data_;
    size_t size_;
public:
    // 建構函式
    explicit Buffer(size_t size) : data_(new int[size]), size_(size) {
        std::cout << "Construct: size=" << size << std::endl;
        for (size_t i = 0; i < size; ++i) data_[i] = static_cast<int>(i);
    }

    // 解構函式
    ~Buffer() {
        delete[] data_;
        std::cout << "Destruct: size=" << size_ << std::endl;
    }

    // 拷貝建構
    Buffer(const Buffer& other) : data_(new int[other.size_]), size_(other.size_) {
        std::copy(other.data_, other.data_ + size_, data_);
        std::cout << "Copy: size=" << size_ << std::endl;
    }

    // 移動建構
    Buffer(Buffer&& other) noexcept : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;
        other.size_ = 0;
        std::cout << "Move: size=" << size_ << std::endl;
    }

    // 拷貝賦值
    Buffer& operator=(const Buffer& other) {
        if (this != &other) {
            delete[] data_;
            size_ = other.size_;
            data_ = new int[size_];
            std::copy(other.data_, other.data_ + size_, data_);
            std::cout << "Copy assign: size=" << size_ << std::endl;
        }
        return *this;
    }

    // 移動賦值
    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            data_ = other.data_;
            size_ = other.size_;
            other.data_ = nullptr;
            other.size_ = 0;
            std::cout << "Move assign: size=" << size_ << std::endl;
        }
        return *this;
    }

    size_t size() const { return size_; }
};

int main() {
    Buffer b1(1000);
    std::cout << "--- Copy ---" << std::endl;
    Buffer b2 = b1;         // 拷貝建構
    std::cout << "--- Move ---" << std::endl;
    Buffer b3 = std::move(b1); // 移動建構（更快！）
    std::cout << "b1 size after move: " << b1.size() << std::endl;
    std::cout << "b3 size: " << b3.size() << std::endl;

    // 搭配 vector
    std::cout << "--- Vector push_back ---" << std::endl;
    std::vector<Buffer> vec;
    vec.reserve(2);
    vec.push_back(Buffer(100));  // 移動臨時物件
    vec.push_back(std::move(b2)); // 明確移動

    return 0;
}`,
    exercise: {
      title: '移動語意練習',
      description: '實作一個 DynamicArray 類別，包含移動建構和移動賦值：\n1. 建立兩個 DynamicArray\n2. 用 std::move 測試移動語意\n3. 印出移動前後的大小驗證',
      starterCode: `#include <iostream>
#include <utility>

class DynamicArray {
    int* data_;
    int size_;
public:
    DynamicArray(int size) : data_(new int[size]), size_(size) {
        for (int i = 0; i < size; i++) data_[i] = i + 1;
        std::cout << "Created: size=" << size_ << std::endl;
    }
    ~DynamicArray() { delete[] data_; }

    // TODO: 實作移動建構函式

    // TODO: 實作移動賦值運算子

    int size() const { return size_; }
    int sum() const {
        int s = 0;
        for (int i = 0; i < size_; i++) s += data_[i];
        return s;
    }
};

int main() {
    DynamicArray a(5);
    std::cout << "a: size=" << a.size() << " sum=" << a.sum() << std::endl;

    DynamicArray b = std::move(a);
    std::cout << "After move:" << std::endl;
    std::cout << "a: size=" << a.size() << std::endl;
    std::cout << "b: size=" << b.size() << " sum=" << b.sum() << std::endl;

    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: 'Created: size=5\na: size=5 sum=15\nAfter move:\na: size=0\nb: size=5 sum=15' }
      ],
      hints: [
        '移動建構：接管 other 的 data_ 和 size_，將 other 設為空',
        '記得加 noexcept',
        '移動後 other.data_ = nullptr, other.size_ = 0'
      ]
    }
  },
  {
    id: 'variadic-templates',
    category: 'cpp11-syntax',
    title: '可變參數模板',
    description: '使用 template parameter pack 建立接受任意數量參數的函式與類別。',
    difficulty: 'advanced',
    content: `# 可變參數模板 (Variadic Templates)

## 基本語法

\`\`\`cpp
template<typename... Args>
void print(Args... args) { /* ... */ }
\`\`\`

## Parameter Pack 展開

C++17 的 fold expression 讓展開更簡潔：

\`\`\`cpp
template<typename... Args>
auto sum(Args... args) {
    return (args + ...); // fold expression
}
\`\`\`

## 遞迴展開（C++11 風格）

\`\`\`cpp
void print() {} // base case
template<typename T, typename... Rest>
void print(T first, Rest... rest) {
    std::cout << first << " ";
    print(rest...);
}
\`\`\`

## 應用場景

- 型別安全的 printf
- std::make_unique / std::make_shared 的實作
- tuple 的實作
`,
    codeExample: `#include <iostream>
#include <string>
#include <sstream>

// C++17 fold expression
template<typename... Args>
auto sum(Args... args) {
    return (args + ...);
}

// 型別安全的 print
template<typename... Args>
void print(Args&&... args) {
    ((std::cout << args << " "), ...);
    std::cout << std::endl;
}

// 計算參數個數
template<typename... Args>
constexpr size_t count_args(Args&&...) {
    return sizeof...(Args);
}

// 建立格式化字串
template<typename... Args>
std::string format(Args&&... args) {
    std::ostringstream oss;
    ((oss << args), ...);
    return oss.str();
}

int main() {
    // sum
    std::cout << "Sum: " << sum(1, 2, 3, 4, 5) << std::endl;
    std::cout << "Sum: " << sum(1.5, 2.5, 3.0) << std::endl;

    // print
    print("Hello", 42, 3.14, "World");

    // count
    std::cout << "Args: " << count_args(1, "two", 3.0) << std::endl;

    // format
    std::string msg = format("Score: ", 95, "/", 100);
    std::cout << msg << std::endl;

    return 0;
}`,
    exercise: {
      title: '可變參數模板練習',
      description: '實作一個 max_of 函式，接受任意數量的參數並回傳最大值。',
      starterCode: `#include <iostream>

// TODO: 實作 max_of 函式
// 使用可變參數模板，支援任意數量的參數
// 提示：可以用遞迴或 fold expression

int main() {
    std::cout << max_of(3, 7, 2, 9, 4) << std::endl;
    std::cout << max_of(1.5, 3.7, 2.1) << std::endl;
    std::cout << max_of(42) << std::endl;
    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: '9\n3.7\n42' }
      ],
      hints: [
        'Base case: 只有一個參數時直接回傳',
        '遞迴: max_of(first, rest...) = std::max(first, max_of(rest...))',
        '或使用 fold expression 搭配 std::max'
      ]
    }
  },

  // ===== C++14/17/20 =====
  {
    id: 'structured-bindings',
    category: 'cpp14-17-20',
    title: '結構化綁定 (C++17)',
    description: 'C++17 的結構化綁定讓你優雅地解構 pair、tuple、struct 和陣列。',
    difficulty: 'beginner',
    content: `# 結構化綁定 (Structured Bindings)

## 語法

\`\`\`cpp
auto [var1, var2, ...] = expression;
\`\`\`

## 適用型別

1. **陣列**：
\`\`\`cpp
int arr[] = {1, 2, 3};
auto [a, b, c] = arr;
\`\`\`

2. **pair / tuple**：
\`\`\`cpp
auto [key, value] = std::make_pair("name", 42);
\`\`\`

3. **struct**：
\`\`\`cpp
struct Point { int x, y; };
auto [x, y] = Point{3, 4};
\`\`\`

4. **map 遍歷**：
\`\`\`cpp
for (const auto& [key, val] : myMap) { ... }
\`\`\`

## Best Practice

- 搭配 const auto& 避免不必要的拷貝
- 變數名稱要有意義
`,
    codeExample: `#include <iostream>
#include <map>
#include <tuple>
#include <string>
#include <vector>

struct Student {
    std::string name;
    int age;
    double gpa;
};

std::tuple<int, std::string, bool> getStatus() {
    return {200, "OK", true};
}

int main() {
    // pair
    auto [min, max] = std::make_pair(1, 100);
    std::cout << "Range: " << min << " - " << max << std::endl;

    // tuple
    auto [code, message, success] = getStatus();
    std::cout << "Status: " << code << " " << message << std::endl;

    // struct
    Student s{"Alice", 20, 3.8};
    auto [name, age, gpa] = s;
    std::cout << name << ", age " << age << ", GPA " << gpa << std::endl;

    // map 遍歷
    std::map<std::string, int> scores = {
        {"Alice", 95}, {"Bob", 87}, {"Charlie", 92}
    };

    for (const auto& [student, score] : scores) {
        std::cout << student << ": " << score << std::endl;
    }

    // 陣列
    int coords[] = {10, 20, 30};
    auto [x, y, z] = coords;
    std::cout << "Position: (" << x << ", " << y << ", " << z << ")" << std::endl;

    return 0;
}`,
    exercise: {
      title: '結構化綁定練習',
      description: '使用結構化綁定處理學生資料：\n1. 讀取 N 個學生的姓名和成績\n2. 找出最高分和最低分的學生\n3. 輸出結果',
      starterCode: `#include <iostream>
#include <vector>
#include <string>
#include <utility>

int main() {
    int n;
    std::cin >> n;

    std::vector<std::pair<std::string, int>> students;
    for (int i = 0; i < n; i++) {
        std::string name;
        int score;
        std::cin >> name >> score;
        students.emplace_back(name, score);
    }

    // TODO: 用結構化綁定遍歷找出最高分和最低分
    // 輸出格式:
    // Max: <name> <score>
    // Min: <name> <score>

    return 0;
}`,
      testCases: [
        { input: '3\nAlice 95\nBob 72\nCharlie 88', expectedOutput: 'Max: Alice 95\nMin: Bob 72' }
      ],
      hints: [
        '用 auto [name, score] 解構 pair',
        '初始化 max/min 為第一個學生',
        'for (const auto& [name, score] : students)'
      ]
    }
  },
  {
    id: 'optional-variant-any',
    category: 'cpp14-17-20',
    title: 'std::optional, variant, any',
    description: 'C++17 的三大實用型別：表達可能沒有值、多種型別之一、任意型別。',
    difficulty: 'intermediate',
    content: `# std::optional, variant, any

## std::optional<T>

表達「可能沒有值」的語意，取代使用特殊值或指標：

\`\`\`cpp
std::optional<int> find(const std::vector<int>& v, int target) {
    for (auto x : v)
        if (x == target) return x;
    return std::nullopt;
}
\`\`\`

## std::variant<Types...>

型別安全的 union，可以持有指定型別之一：

\`\`\`cpp
std::variant<int, double, std::string> v;
v = 42;
v = "hello"s;
std::get<std::string>(v); // "hello"
\`\`\`

## std::any

可持有任意型別的值（類似 void*，但型別安全）：

\`\`\`cpp
std::any a = 42;
a = std::string("hello");
auto s = std::any_cast<std::string>(a);
\`\`\`

## Best Practice

- 優先使用 optional（明確語意）
- variant 搭配 std::visit 使用
- any 盡量少用，優先考慮 variant
`,
    codeExample: `#include <iostream>
#include <optional>
#include <variant>
#include <any>
#include <string>
#include <vector>
#include <cmath>

// optional: 安全的查找函式
std::optional<int> safeDivide(int a, int b) {
    if (b == 0) return std::nullopt;
    return a / b;
}

std::optional<double> safeSqrt(double x) {
    if (x < 0) return std::nullopt;
    return std::sqrt(x);
}

// variant: 計算表達式結果
using Result = std::variant<int, double, std::string>;

Result calculate(const std::string& op, double a, double b) {
    if (op == "+") return a + b;
    if (op == "-") return a - b;
    if (op == "*") return a * b;
    if (op == "/" && b != 0) return a / b;
    return std::string("Error: invalid operation");
}

int main() {
    // optional
    auto r1 = safeDivide(10, 3);
    auto r2 = safeDivide(10, 0);
    std::cout << "10/3 = " << r1.value_or(-1) << std::endl;
    std::cout << "10/0 = " << r2.value_or(-1) << std::endl;

    if (auto sq = safeSqrt(16.0)) {
        std::cout << "sqrt(16) = " << *sq << std::endl;
    }

    // variant + visit
    Result res = calculate("+", 3.0, 4.0);
    std::visit([](const auto& val) {
        std::cout << "Result: " << val << std::endl;
    }, res);

    // any
    std::vector<std::any> mixed;
    mixed.push_back(42);
    mixed.push_back(3.14);
    mixed.push_back(std::string("hello"));

    for (const auto& item : mixed) {
        if (item.type() == typeid(int))
            std::cout << "int: " << std::any_cast<int>(item) << std::endl;
        else if (item.type() == typeid(double))
            std::cout << "double: " << std::any_cast<double>(item) << std::endl;
        else if (item.type() == typeid(std::string))
            std::cout << "string: " << std::any_cast<std::string>(item) << std::endl;
    }

    return 0;
}`,
    exercise: {
      title: 'optional 與 variant 練習',
      description: '實作一個安全的字串轉整數函式：\n1. 使用 std::optional<int> 作為回傳型別\n2. 如果字串是有效整數，回傳該值\n3. 否則回傳 std::nullopt\n4. 測試多個輸入並輸出結果',
      starterCode: `#include <iostream>
#include <optional>
#include <string>

// TODO: 實作 safe_stoi 函式
// 提示: 用 try-catch 包住 std::stoi

int main() {
    std::string s;
    while (std::cin >> s) {
        auto result = safe_stoi(s);
        if (result) {
            std::cout << "Valid: " << *result << std::endl;
        } else {
            std::cout << "Invalid" << std::endl;
        }
    }
    return 0;
}`,
      testCases: [
        { input: '42 abc 100 12.5', expectedOutput: 'Valid: 42\nInvalid\nValid: 100\nValid: 12' }
      ],
      hints: [
        '用 try { return std::stoi(s); } catch (...) { return std::nullopt; }',
        'std::stoi 會把 "12.5" 轉成 12',
        'std::stoi 對非數字字串會拋出 std::invalid_argument'
      ]
    }
  },
  {
    id: 'concepts-cpp20',
    category: 'cpp14-17-20',
    title: 'Concepts 概念 (C++20)',
    description: 'C++20 Concepts 讓模板約束更清晰，提供更好的錯誤訊息。',
    difficulty: 'advanced',
    content: `# Concepts (C++20)

## 為什麼需要 Concepts？

模板錯誤訊息難以閱讀。Concepts 提供：
- 明確的型別約束
- 更友善的編譯錯誤
- 更好的文件化

## 定義 Concept

\`\`\`cpp
template<typename T>
concept Numeric = std::is_arithmetic_v<T>;

template<typename T>
concept Printable = requires(T t) {
    { std::cout << t } -> std::same_as<std::ostream&>;
};
\`\`\`

## 使用 Concept

\`\`\`cpp
// 方式一：requires clause
template<typename T> requires Numeric<T>
T add(T a, T b) { return a + b; }

// 方式二：簡潔語法
template<Numeric T>
T multiply(T a, T b) { return a * b; }

// 方式三：auto 語法
Numeric auto square(Numeric auto x) { return x * x; }
\`\`\`
`,
    codeExample: `#include <iostream>
#include <concepts>
#include <vector>
#include <string>
#include <type_traits>

// 定義 Concepts
template<typename T>
concept Numeric = std::is_arithmetic_v<T>;

template<typename T>
concept Addable = requires(T a, T b) {
    { a + b } -> std::convertible_to<T>;
};

template<typename C>
concept Container = requires(C c) {
    c.begin();
    c.end();
    c.size();
};

// 使用 Concepts
template<Numeric T>
T safe_divide(T a, T b) {
    if (b == 0) {
        std::cout << "Division by zero!" << std::endl;
        return 0;
    }
    return a / b;
}

template<Container C>
void print_container(const C& c) {
    std::cout << "[";
    bool first = true;
    for (const auto& elem : c) {
        if (!first) std::cout << ", ";
        std::cout << elem;
        first = false;
    }
    std::cout << "]" << std::endl;
}

template<typename T>
requires Addable<T> && std::copyable<T>
T accumulate(const std::vector<T>& vec) {
    T result{};
    for (const auto& v : vec) result = result + v;
    return result;
}

int main() {
    std::cout << safe_divide(10, 3) << std::endl;
    std::cout << safe_divide(10.0, 3.0) << std::endl;
    safe_divide(10, 0);

    std::vector<int> nums = {1, 2, 3, 4, 5};
    print_container(nums);

    std::vector<std::string> words = {"Hello", " ", "World"};
    print_container(words);

    std::cout << "Sum: " << accumulate(nums) << std::endl;
    std::cout << "Concat: " << accumulate(words) << std::endl;

    return 0;
}`,
    exercise: {
      title: 'Concepts 練習',
      description: '定義並使用 Concepts：\n1. 定義 Sortable concept（需要 < 運算子）\n2. 實作 constrained sort 函式\n3. 測試排序整數和字串',
      starterCode: `#include <iostream>
#include <concepts>
#include <vector>
#include <string>
#include <algorithm>

// TODO: 定義 Sortable concept

// TODO: 實作 my_sort 函式（使用 Concept 約束）

// TODO: 實作 print_sorted 函式

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9};
    my_sort(nums);
    for (const auto& n : nums) std::cout << n << " ";
    std::cout << std::endl;

    std::vector<std::string> words = {"banana", "apple", "cherry"};
    my_sort(words);
    for (const auto& w : words) std::cout << w << " ";
    std::cout << std::endl;

    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: '1 2 5 8 9 \napple banana cherry ' }
      ],
      hints: [
        'concept Sortable = requires(T a, T b) { { a < b } -> std::convertible_to<bool>; }',
        '函式簽名: template<Sortable T> void my_sort(std::vector<T>& v)',
        '內部直接用 std::sort'
      ]
    }
  },
  {
    id: 'ranges-cpp20',
    category: 'cpp14-17-20',
    title: 'Ranges 範圍庫 (C++20)',
    description: 'C++20 Ranges 讓你用管線風格組合演算法，告別 begin/end 迭代器對。',
    difficulty: 'advanced',
    content: `# Ranges (C++20)

## 基本概念

Ranges 讓你直接對容器操作，不需要傳 begin/end：

\`\`\`cpp
std::ranges::sort(vec);
auto it = std::ranges::find(vec, 42);
\`\`\`

## Views（惰性求值）

Views 不會建立新容器，而是在遍歷時動態計算：

\`\`\`cpp
auto even = vec | std::views::filter([](int n){ return n % 2 == 0; });
auto squared = vec | std::views::transform([](int n){ return n * n; });
\`\`\`

## 管線組合

\`\`\`cpp
auto result = vec
    | std::views::filter([](int n){ return n > 0; })
    | std::views::transform([](int n){ return n * n; })
    | std::views::take(5);
\`\`\`

## 常用 Views

- \`filter\` - 過濾
- \`transform\` - 轉換
- \`take\` / \`drop\` - 取前/去前 N 個
- \`reverse\` - 反轉
- \`keys\` / \`values\` - map 的鍵/值
`,
    codeExample: `#include <iostream>
#include <vector>
#include <ranges>
#include <algorithm>
#include <string>
#include <numeric>

int main() {
    std::vector<int> nums = {1, -2, 3, -4, 5, -6, 7, 8, -9, 10};

    // ranges::sort
    std::ranges::sort(nums);
    std::cout << "Sorted: ";
    for (auto n : nums) std::cout << n << " ";
    std::cout << std::endl;

    // filter + transform pipeline
    std::cout << "Positive squares: ";
    for (auto val : nums
            | std::views::filter([](int n) { return n > 0; })
            | std::views::transform([](int n) { return n * n; })) {
        std::cout << val << " ";
    }
    std::cout << std::endl;

    // take and drop
    std::cout << "First 3: ";
    for (auto val : nums | std::views::take(3)) {
        std::cout << val << " ";
    }
    std::cout << std::endl;

    // iota view (generate sequence)
    std::cout << "1 to 5: ";
    for (auto i : std::views::iota(1, 6)) {
        std::cout << i << " ";
    }
    std::cout << std::endl;

    // reverse
    std::vector<std::string> words = {"Hello", "Modern", "C++", "Ranges"};
    std::cout << "Reversed: ";
    for (const auto& w : words | std::views::reverse) {
        std::cout << w << " ";
    }
    std::cout << std::endl;

    return 0;
}`,
    exercise: {
      title: 'Ranges 練習',
      description: '使用 C++20 Ranges：\n1. 讀取 N 個整數\n2. 用 ranges pipeline 過濾出偶數\n3. 將偶數平方\n4. 取前 3 個結果輸出',
      starterCode: `#include <iostream>
#include <vector>
#include <ranges>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> nums(n);
    for (auto& x : nums) std::cin >> x;

    // TODO: 使用 ranges pipeline
    // filter 偶數 -> transform 平方 -> take 3
    // 輸出結果（空格分隔）

    return 0;
}`,
      testCases: [
        { input: '8\n1 2 3 4 5 6 7 8', expectedOutput: '4 16 36' },
        { input: '5\n1 3 5 7 2', expectedOutput: '4' }
      ],
      hints: [
        'std::views::filter([](int n){ return n % 2 == 0; })',
        'std::views::transform([](int n){ return n * n; })',
        'std::views::take(3)',
        '用 | 管線連接'
      ]
    }
  },

  // ===== BEST PRACTICES =====
  {
    id: 'raii-resource-management',
    category: 'best-practices',
    title: 'RAII 資源管理',
    description: '資源取得即初始化 — C++ 最核心的程式設計慣例，確保資源安全釋放。',
    difficulty: 'intermediate',
    content: `# RAII (Resource Acquisition Is Initialization)

## 核心概念

RAII 是 C++ 最重要的慣用法：
- **取得資源**（記憶體、檔案、鎖）在**建構函式**中進行
- **釋放資源**在**解構函式**中自動進行
- 物件離開作用域時，解構函式自動被呼叫

## 為什麼 RAII 重要？

\`\`\`cpp
// 不使用 RAII（危險！）
void unsafe() {
    int* p = new int[100];
    // 如果這裡拋出異常，記憶體洩漏！
    process(p);
    delete[] p;
}

// 使用 RAII（安全）
void safe() {
    auto p = std::make_unique<int[]>(100);
    process(p.get());
} // 自動釋放
\`\`\`

## RAII 應用

- 智慧指標管理記憶體
- std::lock_guard 管理互斥鎖
- std::fstream 管理檔案
- 自定義 RAII wrapper

## Best Practice

- 所有資源都應該被 RAII 物件管理
- 永遠不要手動管理資源（new/delete, fopen/fclose）
- 讓解構函式做清理工作
`,
    codeExample: `#include <iostream>
#include <fstream>
#include <memory>
#include <string>
#include <mutex>
#include <vector>

// 自定義 RAII 類別：計時器
class Timer {
    std::string name_;
    std::chrono::high_resolution_clock::time_point start_;
public:
    Timer(const std::string& name) : name_(name),
        start_(std::chrono::high_resolution_clock::now()) {
        std::cout << "[" << name_ << "] Started" << std::endl;
    }
    ~Timer() {
        auto end = std::chrono::high_resolution_clock::now();
        auto ms = std::chrono::duration_cast<std::chrono::microseconds>(end - start_);
        std::cout << "[" << name_ << "] Elapsed: " << ms.count() << "us" << std::endl;
    }
};

// RAII 檔案 wrapper
class FileWriter {
    std::ofstream file_;
public:
    FileWriter(const std::string& path) : file_(path) {
        if (!file_.is_open()) throw std::runtime_error("Cannot open file");
        std::cout << "File opened: " << path << std::endl;
    }
    ~FileWriter() {
        if (file_.is_open()) {
            file_.close();
            std::cout << "File closed automatically" << std::endl;
        }
    }
    void write(const std::string& data) { file_ << data; }
};

// RAII lock guard 示範
std::mutex mtx;
void safe_print(const std::string& msg) {
    std::lock_guard<std::mutex> lock(mtx); // 自動上鎖/解鎖
    std::cout << msg << std::endl;
}

int main() {
    // Timer RAII
    {
        Timer t("Processing");
        volatile int sum = 0;
        for (int i = 0; i < 1000000; ++i) sum += i;
    } // Timer 自動輸出經過時間

    // 智慧指標 RAII
    {
        auto data = std::make_unique<std::vector<int>>();
        data->push_back(1);
        data->push_back(2);
        std::cout << "Vector size: " << data->size() << std::endl;
    } // 自動釋放

    safe_print("Thread-safe output");

    std::cout << "RAII ensures safety!" << std::endl;
    return 0;
}`,
    exercise: {
      title: 'RAII 練習',
      description: '實作一個 RAII 的 ScopeGuard 類別：\n1. 建構時接受一個 std::function<void()>\n2. 解構時自動呼叫該函式\n3. 提供 dismiss() 方法取消呼叫',
      starterCode: `#include <iostream>
#include <functional>

// TODO: 實作 ScopeGuard 類別

int main() {
    std::cout << "Start" << std::endl;
    {
        ScopeGuard guard([]() {
            std::cout << "Cleanup 1" << std::endl;
        });
    }

    {
        ScopeGuard guard([]() {
            std::cout << "Cleanup 2" << std::endl;
        });
        guard.dismiss();
    }

    std::cout << "End" << std::endl;
    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: 'Start\nCleanup 1\nEnd' }
      ],
      hints: [
        '使用 std::function<void()> 儲存回呼',
        '用 bool active_ 追蹤是否需要呼叫',
        'dismiss() 設定 active_ = false',
        '解構函式中檢查 active_ 後再呼叫'
      ]
    }
  },
  {
    id: 'const-correctness',
    category: 'best-practices',
    title: 'const 正確性',
    description: '善用 const 提高程式碼安全性、可讀性和最佳化機會。',
    difficulty: 'intermediate',
    content: `# const 正確性

## 為什麼重要？

- 防止意外修改
- 向讀者傳達意圖
- 讓編譯器進行更好的最佳化
- 確保 thread safety

## const 的位置很重要

\`\`\`cpp
const int* p;        // 指向 const int 的指標（不能改值）
int* const p;        // const 指標（不能改指向）
const int* const p;  // 都不能改
\`\`\`

## const 成員函式

\`\`\`cpp
class MyClass {
    int getValue() const;    // 不修改物件狀態
    void setValue(int v);    // 可能修改物件狀態
};
\`\`\`

## const 參數

\`\`\`cpp
void print(const std::string& s); // 傳 const 引用
void process(const std::vector<int>& v);
\`\`\`

## Best Practice

- 能加 const 就加 const
- 成員函式盡量標 const
- 參數傳遞用 const reference
- 回傳值考慮是否需要 const
`,
    codeExample: `#include <iostream>
#include <string>
#include <vector>

class Account {
    std::string owner_;
    double balance_;
    mutable int access_count_ = 0; // mutable: 即使 const 也能修改

public:
    Account(const std::string& owner, double balance)
        : owner_(owner), balance_(balance) {}

    // const 成員函式
    const std::string& owner() const {
        ++access_count_; // OK: mutable
        return owner_;
    }

    double balance() const { return balance_; }
    int accessCount() const { return access_count_; }

    // 非 const 成員函式
    void deposit(double amount) {
        if (amount > 0) balance_ += amount;
    }

    void withdraw(double amount) {
        if (amount > 0 && amount <= balance_)
            balance_ -= amount;
    }
};

// const reference 參數
void printAccount(const Account& acc) {
    std::cout << acc.owner() << ": $" << acc.balance() << std::endl;
    // acc.deposit(100); // 編譯錯誤！const 物件不能呼叫非 const 函式
}

// constexpr: 編譯期常數
constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}

int main() {
    Account acc("Alice", 1000.0);
    acc.deposit(500);
    printAccount(acc);
    std::cout << "Access count: " << acc.accessCount() << std::endl;

    // const 物件
    const Account savings("Bob", 5000.0);
    std::cout << savings.owner() << ": $" << savings.balance() << std::endl;
    // savings.deposit(100); // 編譯錯誤！

    // constexpr
    constexpr int fact5 = factorial(5);
    std::cout << "5! = " << fact5 << std::endl;

    // const 與容器
    const std::vector<int> nums = {1, 2, 3, 4, 5};
    // nums.push_back(6); // 編譯錯誤！
    for (const auto& n : nums) {
        std::cout << n << " ";
    }
    std::cout << std::endl;

    return 0;
}`,
    exercise: {
      title: 'const 正確性練習',
      description: '修正以下程式碼的 const 問題：\n1. 適當加上 const 修飾\n2. 確保成員函式的 const 正確性\n3. 修正參數傳遞方式',
      starterCode: `#include <iostream>
#include <string>
#include <vector>

class Student {
    std::string name_;
    std::vector<int> grades_;
public:
    Student(std::string name) : name_(name) {}

    // TODO: 加上適當的 const
    std::string getName() { return name_; }

    void addGrade(int grade) { grades_.push_back(grade); }

    // TODO: 加上適當的 const
    double getAverage() {
        double sum = 0;
        for (auto g : grades_) sum += g;
        return grades_.empty() ? 0 : sum / grades_.size();
    }
};

// TODO: 修正參數為 const reference
void printStudent(Student s) {
    std::cout << s.getName() << ": " << s.getAverage() << std::endl;
}

int main() {
    Student s("Alice");
    s.addGrade(90);
    s.addGrade(85);
    s.addGrade(92);
    printStudent(s);
    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: 'Alice: 89' }
      ],
      hints: [
        'getName() 應該是 const 成員函式，回傳 const string&',
        'getAverage() 應該是 const 成員函式',
        'printStudent 參數應改為 const Student&'
      ]
    }
  },

  // ===== DESIGN PATTERNS =====
  {
    id: 'singleton-pattern',
    category: 'design-patterns',
    title: '單例模式 (Singleton)',
    description: '使用 Modern C++ 技術安全實現單例模式，包含 thread-safe 的 Meyer\'s Singleton。',
    difficulty: 'intermediate',
    content: `# 單例模式 (Singleton Pattern)

## Modern C++ Singleton: Meyer's Singleton

C++11 保證 static local variable 的初始化是 thread-safe 的：

\`\`\`cpp
class Singleton {
public:
    static Singleton& instance() {
        static Singleton inst;
        return inst;
    }
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
private:
    Singleton() = default;
};
\`\`\`

## 為什麼優於傳統寫法？

- 不需要 double-checked locking
- 編譯器保證 thread safety
- 自動處理銷毀順序
- 惰性初始化（首次使用時才建立）

## 何時使用？

- 全域組態管理
- 日誌系統
- 連線池
- 注意：過度使用 Singleton 是 anti-pattern！
`,
    codeExample: `#include <iostream>
#include <string>
#include <map>
#include <mutex>

// Modern C++ Singleton: 組態管理器
class ConfigManager {
public:
    static ConfigManager& instance() {
        static ConfigManager inst;
        return inst;
    }

    // 禁止拷貝和移動
    ConfigManager(const ConfigManager&) = delete;
    ConfigManager& operator=(const ConfigManager&) = delete;

    void set(const std::string& key, const std::string& value) {
        std::lock_guard<std::mutex> lock(mutex_);
        config_[key] = value;
    }

    std::string get(const std::string& key) const {
        std::lock_guard<std::mutex> lock(mutex_);
        auto it = config_.find(key);
        return it != config_.end() ? it->second : "";
    }

    void printAll() const {
        std::lock_guard<std::mutex> lock(mutex_);
        for (const auto& [key, value] : config_) {
            std::cout << key << " = " << value << std::endl;
        }
    }

private:
    ConfigManager() {
        std::cout << "ConfigManager created" << std::endl;
    }
    ~ConfigManager() {
        std::cout << "ConfigManager destroyed" << std::endl;
    }

    std::map<std::string, std::string> config_;
    mutable std::mutex mutex_;
};

int main() {
    // 取得單例
    auto& config = ConfigManager::instance();

    config.set("app.name", "CppTrainer");
    config.set("app.version", "1.0");
    config.set("db.host", "localhost");

    // 從不同地方取得同一個實例
    auto& config2 = ConfigManager::instance();
    std::cout << "Name: " << config2.get("app.name") << std::endl;
    std::cout << "Version: " << config2.get("app.version") << std::endl;

    // 驗證是同一個實例
    std::cout << "Same instance: "
              << (&config == &config2 ? "yes" : "no") << std::endl;

    config.printAll();

    return 0;
}`,
    exercise: {
      title: 'Singleton 練習',
      description: '實作一個 Logger Singleton：\n1. 使用 Meyer\'s Singleton\n2. 提供 log(message) 方法\n3. 記錄訊息數量\n4. 提供 count() 方法查詢',
      starterCode: `#include <iostream>
#include <string>

// TODO: 實作 Logger singleton

int main() {
    Logger::instance().log("App started");
    Logger::instance().log("Processing data");
    Logger::instance().log("App finished");
    std::cout << "Total: " << Logger::instance().count() << std::endl;
    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: '[LOG] App started\n[LOG] Processing data\n[LOG] App finished\nTotal: 3' }
      ],
      hints: [
        '使用 static 局部變數實現單例',
        '刪除拷貝建構和賦值',
        '用 int count_ 成員計數'
      ]
    }
  },
  {
    id: 'observer-pattern',
    category: 'design-patterns',
    title: '觀察者模式 (Observer)',
    description: '使用 Modern C++ 的 function、shared_ptr 實現觀察者模式。',
    difficulty: 'advanced',
    content: `# 觀察者模式 (Observer Pattern)

## 概念

定義物件間的一對多依賴關係：當一個物件狀態改變時，所有依賴它的物件都會被通知並自動更新。

## Modern C++ 實現

利用 \`std::function\` 取代傳統的介面繼承：

\`\`\`cpp
class EventEmitter {
    std::unordered_map<std::string,
        std::vector<std::function<void(const std::string&)>>> listeners_;
public:
    void on(const std::string& event, auto&& callback) {
        listeners_[event].push_back(std::forward<decltype(callback)>(callback));
    }
    void emit(const std::string& event, const std::string& data) {
        for (auto& cb : listeners_[event]) cb(data);
    }
};
\`\`\`

## 應用場景

- UI 事件處理
- 資料綁定
- 訊息系統
- 日誌記錄
`,
    codeExample: `#include <iostream>
#include <vector>
#include <functional>
#include <string>
#include <algorithm>

// Modern Observer using std::function
template<typename... Args>
class Signal {
    using SlotType = std::function<void(Args...)>;
    std::vector<std::pair<int, SlotType>> slots_;
    int next_id_ = 0;
public:
    int connect(SlotType slot) {
        int id = next_id_++;
        slots_.emplace_back(id, std::move(slot));
        return id;
    }

    void disconnect(int id) {
        slots_.erase(
            std::remove_if(slots_.begin(), slots_.end(),
                [id](const auto& p) { return p.first == id; }),
            slots_.end());
    }

    void emit(Args... args) const {
        for (const auto& [id, slot] : slots_) {
            slot(args...);
        }
    }
};

// 溫度感測器範例
class TemperatureSensor {
    double temp_ = 20.0;
public:
    Signal<double> onTemperatureChanged;

    void setTemperature(double temp) {
        temp_ = temp;
        onTemperatureChanged.emit(temp_);
    }
};

int main() {
    TemperatureSensor sensor;

    // 觀察者 1: 顯示器
    sensor.onTemperatureChanged.connect([](double temp) {
        std::cout << "Display: " << temp << " C" << std::endl;
    });

    // 觀察者 2: 警報器
    auto alarmId = sensor.onTemperatureChanged.connect([](double temp) {
        if (temp > 30.0) {
            std::cout << "ALARM: High temperature!" << std::endl;
        }
    });

    // 觀察者 3: 記錄器
    sensor.onTemperatureChanged.connect([](double temp) {
        std::cout << "Log: temp=" << temp << std::endl;
    });

    sensor.setTemperature(25.0);
    std::cout << "---" << std::endl;
    sensor.setTemperature(35.0);

    // 斷開警報器
    std::cout << "--- (alarm disconnected) ---" << std::endl;
    sensor.onTemperatureChanged.disconnect(alarmId);
    sensor.setTemperature(40.0);

    return 0;
}`,
    exercise: {
      title: '觀察者模式練習',
      description: '實作一個股價通知系統：\n1. Stock 類別有 name 和 price\n2. 價格變動時通知所有觀察者\n3. 觀察者印出 "<name>: $<old_price> -> $<new_price>"',
      starterCode: `#include <iostream>
#include <string>
#include <vector>
#include <functional>

// TODO: 實作 Stock 類別（含觀察者通知）

int main() {
    Stock apple("AAPL", 150.0);

    apple.addObserver([](const std::string& name, double oldP, double newP) {
        std::cout << name << ": $" << oldP << " -> $" << newP << std::endl;
    });

    apple.setPrice(155.0);
    apple.setPrice(148.0);

    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: 'AAPL: $150 -> $155\nAAPL: $155 -> $148' }
      ],
      hints: [
        '觀察者類型: std::function<void(const string&, double, double)>',
        '用 vector 儲存觀察者',
        'setPrice 時先保存舊價格再更新'
      ]
    }
  },
  {
    id: 'factory-pattern',
    category: 'design-patterns',
    title: '工廠模式 (Factory)',
    description: '使用 unique_ptr 和 unordered_map 實現彈性的工廠模式。',
    difficulty: 'intermediate',
    content: `# 工廠模式 (Factory Pattern)

## 概念

將物件的建立邏輯封裝起來，客戶端不需要知道具體的類別。

## Modern C++ 實現

使用 \`std::unique_ptr\` 管理所有權，\`std::function\` 作為建立器：

\`\`\`cpp
class ShapeFactory {
    std::map<std::string, std::function<std::unique_ptr<Shape>()>> creators_;
public:
    void registerShape(const std::string& name, auto creator) {
        creators_[name] = creator;
    }
    std::unique_ptr<Shape> create(const std::string& name) {
        return creators_.at(name)();
    }
};
\`\`\`

## 優點

- 開放封閉原則：新增產品不需修改工廠
- 自動記憶體管理
- 型別安全
`,
    codeExample: `#include <iostream>
#include <memory>
#include <string>
#include <unordered_map>
#include <functional>
#include <vector>
#include <cmath>

// 抽象產品
class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
    virtual std::string name() const = 0;
    virtual void draw() const {
        std::cout << "Drawing " << name()
                  << " (area=" << area() << ")" << std::endl;
    }
};

// 具體產品
class Circle : public Shape {
    double radius_;
public:
    explicit Circle(double r) : radius_(r) {}
    double area() const override { return M_PI * radius_ * radius_; }
    std::string name() const override { return "Circle"; }
};

class Rectangle : public Shape {
    double w_, h_;
public:
    Rectangle(double w, double h) : w_(w), h_(h) {}
    double area() const override { return w_ * h_; }
    std::string name() const override { return "Rectangle"; }
};

class Triangle : public Shape {
    double base_, height_;
public:
    Triangle(double b, double h) : base_(b), height_(h) {}
    double area() const override { return 0.5 * base_ * height_; }
    std::string name() const override { return "Triangle"; }
};

// 工廠
class ShapeFactory {
    using Creator = std::function<std::unique_ptr<Shape>()>;
    std::unordered_map<std::string, Creator> creators_;
public:
    void registerShape(const std::string& type, Creator creator) {
        creators_[type] = std::move(creator);
    }

    std::unique_ptr<Shape> create(const std::string& type) const {
        auto it = creators_.find(type);
        if (it == creators_.end()) return nullptr;
        return it->second();
    }
};

int main() {
    ShapeFactory factory;

    // 註冊形狀
    factory.registerShape("circle",
        []() { return std::make_unique<Circle>(5.0); });
    factory.registerShape("rectangle",
        []() { return std::make_unique<Rectangle>(4.0, 6.0); });
    factory.registerShape("triangle",
        []() { return std::make_unique<Triangle>(3.0, 8.0); });

    // 建立形狀
    std::vector<std::string> types = {"circle", "rectangle", "triangle"};
    for (const auto& type : types) {
        auto shape = factory.create(type);
        if (shape) shape->draw();
    }

    // 嘗試建立未註冊的形狀
    auto unknown = factory.create("hexagon");
    std::cout << "Hexagon: " << (unknown ? "created" : "not found") << std::endl;

    return 0;
}`,
    exercise: {
      title: '工廠模式練習',
      description: '實作一個飲料工廠：\n1. Beverage 抽象類別有 name() 和 price() 方法\n2. 實作 Coffee, Tea, Juice 三種飲料\n3. 用工廠建立並輸出資訊',
      starterCode: `#include <iostream>
#include <memory>
#include <string>

// TODO: 實作 Beverage 抽象類別和子類別
// TODO: 實作 BeverageFactory

int main() {
    BeverageFactory factory;

    auto coffee = factory.create("coffee");
    auto tea = factory.create("tea");
    auto juice = factory.create("juice");

    if (coffee) std::cout << coffee->name() << ": $" << coffee->price() << std::endl;
    if (tea) std::cout << tea->name() << ": $" << tea->price() << std::endl;
    if (juice) std::cout << juice->name() << ": $" << juice->price() << std::endl;

    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: 'Coffee: $4.5\nTea: $3\nJuice: $5' }
      ],
      hints: [
        '純虛函式: virtual std::string name() const = 0;',
        '工廠可以用 if-else 或 map 實作',
        '回傳 std::unique_ptr<Beverage>'
      ]
    }
  },

  // ===== SYSTEM PROGRAMMING =====
  {
    id: 'threads-and-mutex',
    category: 'system-programming',
    title: '執行緒與互斥鎖',
    description: '使用 std::thread 和 std::mutex 進行多執行緒程式設計。',
    difficulty: 'intermediate',
    content: `# 執行緒與互斥鎖

## std::thread

\`\`\`cpp
#include <thread>

void task(int id) { /* ... */ }
std::thread t(task, 1);
t.join(); // 等待執行緒結束
\`\`\`

## std::mutex & std::lock_guard

\`\`\`cpp
std::mutex mtx;
void safe_increment(int& counter) {
    std::lock_guard<std::mutex> lock(mtx);
    ++counter;
}
\`\`\`

## C++17: std::scoped_lock

可同時鎖定多個 mutex，避免死鎖：

\`\`\`cpp
std::scoped_lock lock(mtx1, mtx2);
\`\`\`

## 常見陷阱

- 忘記 join 或 detach 會導致程式終止
- 資料競爭 (data race)
- 死鎖 (deadlock)
- 過度同步導致效能下降

## Best Practice

- 優先使用 lock_guard/scoped_lock（RAII）
- 最小化臨界區
- 考慮使用 std::atomic 替代簡單的 mutex
`,
    codeExample: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>
#include <atomic>
#include <chrono>

std::mutex cout_mutex;

void safe_print(const std::string& msg) {
    std::lock_guard<std::mutex> lock(cout_mutex);
    std::cout << msg << std::endl;
}

// 基本執行緒
void worker(int id) {
    safe_print("Worker " + std::to_string(id) + " started");
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    safe_print("Worker " + std::to_string(id) + " finished");
}

// 共享計數器（使用 mutex）
class SafeCounter {
    int count_ = 0;
    std::mutex mutex_;
public:
    void increment() {
        std::lock_guard<std::mutex> lock(mutex_);
        ++count_;
    }
    int get() const { return count_; }
};

// 使用 atomic
std::atomic<int> atomic_counter{0};

int main() {
    // 建立多個執行緒
    std::vector<std::thread> threads;
    for (int i = 0; i < 4; ++i) {
        threads.emplace_back(worker, i);
    }
    for (auto& t : threads) {
        t.join();
    }

    std::cout << "---" << std::endl;

    // 安全計數器
    SafeCounter counter;
    std::vector<std::thread> workers;
    for (int i = 0; i < 10; ++i) {
        workers.emplace_back([&counter]() {
            for (int j = 0; j < 1000; ++j) {
                counter.increment();
            }
        });
    }
    for (auto& w : workers) w.join();
    std::cout << "SafeCounter: " << counter.get() << std::endl;

    // Atomic 計數器
    std::vector<std::thread> atomicWorkers;
    for (int i = 0; i < 10; ++i) {
        atomicWorkers.emplace_back([]() {
            for (int j = 0; j < 1000; ++j) {
                atomic_counter.fetch_add(1);
            }
        });
    }
    for (auto& w : atomicWorkers) w.join();
    std::cout << "AtomicCounter: " << atomic_counter.load() << std::endl;

    return 0;
}`,
    exercise: {
      title: '多執行緒練習',
      description: '實作一個 thread-safe 的銀行帳戶：\n1. 支援 deposit 和 withdraw\n2. 用多個執行緒同時操作\n3. 最終餘額必須正確',
      starterCode: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>

class BankAccount {
    double balance_;
    std::mutex mutex_;
public:
    BankAccount(double initial) : balance_(initial) {}

    // TODO: 實作 thread-safe 的 deposit
    // TODO: 實作 thread-safe 的 withdraw

    double balance() const { return balance_; }
};

int main() {
    BankAccount account(1000.0);

    std::vector<std::thread> threads;

    // 5 個執行緒各存入 100
    for (int i = 0; i < 5; i++) {
        threads.emplace_back([&account]() {
            account.deposit(100.0);
        });
    }

    // 3 個執行緒各取出 100
    for (int i = 0; i < 3; i++) {
        threads.emplace_back([&account]() {
            account.withdraw(100.0);
        });
    }

    for (auto& t : threads) t.join();

    std::cout << "Balance: " << account.balance() << std::endl;
    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: 'Balance: 1200' }
      ],
      hints: [
        '用 std::lock_guard<std::mutex> 保護存取',
        'withdraw 要檢查餘額是否足夠',
        '每個方法都需要鎖定 mutex_'
      ]
    }
  },
  {
    id: 'async-and-future',
    category: 'system-programming',
    title: '非同步程式設計 (async/future)',
    description: '使用 std::async、std::future、std::promise 進行高階非同步程式設計。',
    difficulty: 'advanced',
    content: `# 非同步程式設計

## std::async

最簡單的非同步執行方式：

\`\`\`cpp
auto future = std::async(std::launch::async, []() {
    return expensive_computation();
});
auto result = future.get(); // 等待結果
\`\`\`

## std::future & std::promise

\`promise\` 設定值，\`future\` 取得值：

\`\`\`cpp
std::promise<int> promise;
auto future = promise.get_future();

std::thread t([&promise]() {
    promise.set_value(42);
});

int result = future.get();
t.join();
\`\`\`

## Launch Policy

- \`std::launch::async\` - 強制建立新執行緒
- \`std::launch::deferred\` - 延遲到 get() 時執行
- 預設：由實作決定

## Best Practice

- 需要回傳值時使用 std::async
- 不需要回傳值時使用 std::thread
- 注意 future 的生命週期
`,
    codeExample: `#include <iostream>
#include <future>
#include <thread>
#include <vector>
#include <numeric>
#include <chrono>
#include <cmath>

// 模擬耗時計算
long long compute_sum(long long start, long long end) {
    long long sum = 0;
    for (long long i = start; i <= end; ++i) {
        sum += i;
    }
    return sum;
}

// 並行計算
long long parallel_sum(long long n) {
    long long mid = n / 2;

    auto future1 = std::async(std::launch::async,
        compute_sum, 1LL, mid);
    auto future2 = std::async(std::launch::async,
        compute_sum, mid + 1, n);

    return future1.get() + future2.get();
}

// 使用 promise/future 在執行緒間傳遞資料
void producer(std::promise<std::string>& promise) {
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    promise.set_value("Data from producer");
}

int main() {
    // async 基本用法
    auto future = std::async(std::launch::async, []() {
        return 6 * 7;
    });
    std::cout << "6 * 7 = " << future.get() << std::endl;

    // 並行計算
    long long n = 1000000;
    auto result = parallel_sum(n);
    std::cout << "Sum 1 to " << n << " = " << result << std::endl;

    // promise/future
    std::promise<std::string> promise;
    auto data_future = promise.get_future();
    std::thread t(producer, std::ref(promise));
    std::cout << "Received: " << data_future.get() << std::endl;
    t.join();

    // 多個 async 任務
    std::vector<std::future<double>> futures;
    for (int i = 1; i <= 5; ++i) {
        futures.push_back(std::async(std::launch::async, [i]() {
            return std::sqrt(static_cast<double>(i * 100));
        }));
    }

    std::cout << "Square roots: ";
    for (auto& f : futures) {
        std::cout << f.get() << " ";
    }
    std::cout << std::endl;

    return 0;
}`,
    exercise: {
      title: 'async/future 練習',
      description: '使用 std::async 並行處理多個任務：\n1. 計算 N 個數字的平方和（分成兩半並行計算）\n2. 合併結果並輸出',
      starterCode: `#include <iostream>
#include <future>
#include <vector>
#include <numeric>

// TODO: 實作並行的平方和計算

int main() {
    int n;
    std::cin >> n;
    std::vector<long long> nums(n);
    for (auto& x : nums) std::cin >> x;

    // TODO: 將 nums 分成兩半
    // TODO: 用 std::async 並行計算各半的平方和
    // TODO: 合併結果並輸出

    return 0;
}`,
      testCases: [
        { input: '4\n1 2 3 4', expectedOutput: '30' },
        { input: '3\n3 4 5', expectedOutput: '50' }
      ],
      hints: [
        '平方和: sum of (x * x) for each x',
        '用 std::async 啟動兩個任務',
        '用 future.get() 取得結果後相加'
      ]
    }
  },
  {
    id: 'condition-variables',
    category: 'system-programming',
    title: '條件變數與生產者-消費者',
    description: '使用 std::condition_variable 實現執行緒間的同步與通訊。',
    difficulty: 'advanced',
    content: `# 條件變數 (Condition Variables)

## 概念

條件變數允許執行緒等待某個條件成立後再繼續：

\`\`\`cpp
std::mutex mtx;
std::condition_variable cv;
bool ready = false;

// 等待方
std::unique_lock<std::mutex> lock(mtx);
cv.wait(lock, [&]{ return ready; });

// 通知方
{
    std::lock_guard<std::mutex> lock(mtx);
    ready = true;
}
cv.notify_one();
\`\`\`

## 生產者-消費者模式

經典的多執行緒設計模式，使用條件變數和佇列實現。

## 注意事項

- wait 必須搭配 unique_lock（不能用 lock_guard）
- 使用 predicate 版本的 wait 避免虛假喚醒
- notify_one vs notify_all
`,
    codeExample: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <string>
#include <chrono>

// Thread-safe 訊息佇列
template<typename T>
class MessageQueue {
    std::queue<T> queue_;
    std::mutex mutex_;
    std::condition_variable cv_;
    bool done_ = false;

public:
    void push(T value) {
        {
            std::lock_guard<std::mutex> lock(mutex_);
            queue_.push(std::move(value));
        }
        cv_.notify_one();
    }

    bool pop(T& value) {
        std::unique_lock<std::mutex> lock(mutex_);
        cv_.wait(lock, [this] { return !queue_.empty() || done_; });

        if (queue_.empty()) return false;

        value = std::move(queue_.front());
        queue_.pop();
        return true;
    }

    void close() {
        {
            std::lock_guard<std::mutex> lock(mutex_);
            done_ = true;
        }
        cv_.notify_all();
    }
};

int main() {
    MessageQueue<std::string> mq;

    // 生產者
    std::thread producer([&mq]() {
        for (int i = 1; i <= 5; ++i) {
            std::string msg = "Message " + std::to_string(i);
            std::cout << "Produced: " << msg << std::endl;
            mq.push(msg);
            std::this_thread::sleep_for(std::chrono::milliseconds(50));
        }
        mq.close();
    });

    // 消費者
    std::thread consumer([&mq]() {
        std::string msg;
        while (mq.pop(msg)) {
            std::cout << "Consumed: " << msg << std::endl;
        }
        std::cout << "Consumer done" << std::endl;
    });

    producer.join();
    consumer.join();

    return 0;
}`,
    exercise: {
      title: '生產者-消費者練習',
      description: '實作一個多生產者多消費者系統：\n1. 2 個生產者各產生 5 個數字\n2. 2 個消費者計算收到的數字之和\n3. 最後輸出總和',
      starterCode: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <vector>
#include <atomic>

// TODO: 實作 thread-safe queue
// TODO: 實作生產者和消費者邏輯

int main() {
    // TODO: 建立 2 個生產者
    // 生產者 0 產生: 1, 2, 3, 4, 5
    // 生產者 1 產生: 6, 7, 8, 9, 10

    // TODO: 建立 2 個消費者，加總所有數字

    // TODO: 輸出總和 (應為 55)

    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: '55' }
      ],
      hints: [
        '使用上面範例的 MessageQueue 模板',
        'std::atomic<int> 用於安全地累加總和',
        '生產者完成後呼叫 close()',
        '消費者從 queue pop 直到 queue 關閉'
      ]
    }
  },

  // ===== MORE DESIGN PATTERNS =====
  {
    id: 'strategy-pattern',
    category: 'design-patterns',
    title: '策略模式 (Strategy)',
    description: '使用 std::function 與 Lambda 實現策略模式，在執行期動態切換演算法。',
    difficulty: 'intermediate',
    content: `# 策略模式 (Strategy Pattern)

## 概念

將演算法封裝成獨立的策略物件，讓它們可以互相替換。客戶端可以在執行期動態選擇不同的策略。

## 傳統 vs Modern C++ 實現

### 傳統做法：繼承 + 虛擬函式

\`\`\`cpp
class SortStrategy {
public:
    virtual ~SortStrategy() = default;
    virtual void sort(std::vector<int>& data) = 0;
};

class BubbleSort : public SortStrategy { ... };
class QuickSort : public SortStrategy { ... };
\`\`\`

### Modern C++：std::function + Lambda

不需要定義一堆子類別，直接用 \`std::function\` 作為策略：

\`\`\`cpp
class Sorter {
    std::function<void(std::vector<int>&)> strategy_;
public:
    void setStrategy(std::function<void(std::vector<int>&)> s) {
        strategy_ = std::move(s);
    }
    void sort(std::vector<int>& data) { strategy_(data); }
};
\`\`\`

## 搭配 std::variant 的策略模式

C++17 的 \`std::variant\` + \`std::visit\` 提供了另一種零成本的策略切換：

\`\`\`cpp
using Strategy = std::variant<BubbleSort, QuickSort, MergeSort>;

void execute(Strategy& s, std::vector<int>& data) {
    std::visit([&data](auto& algo) { algo.sort(data); }, s);
}
\`\`\`

這種方式是 **編譯期多態**，沒有虛擬函式的額外開銷。

## 何時使用？

- 多種演算法需要互換（排序、壓縮、定價策略）
- 避免大量 if-else / switch 判斷
- 需要在執行期改變行為

## Best Practice

- 簡單情境用 \`std::function\` + lambda（最靈活）
- 效能敏感用 \`std::variant\` + \`std::visit\`（零成本）
- 策略數量固定且已知時優先考慮 variant
- 策略數量不確定或需要外掛機制時用 std::function
`,
    codeExample: `#include <iostream>
#include <vector>
#include <functional>
#include <algorithm>
#include <string>
#include <variant>
#include <cmath>

// ====== 方法一：std::function + Lambda ======

class TextFormatter {
    std::function<std::string(const std::string&)> strategy_;
    std::string name_;

public:
    TextFormatter(std::string name,
                  std::function<std::string(const std::string&)> strategy)
        : name_(std::move(name)), strategy_(std::move(strategy)) {}

    void setStrategy(std::function<std::string(const std::string&)> s) {
        strategy_ = std::move(s);
    }

    std::string format(const std::string& text) const {
        return strategy_(text);
    }
};

// ====== 方法二：std::variant + std::visit（零成本多態）======

struct DiscountNone {
    double apply(double price) const { return price; }
};

struct DiscountPercent {
    double rate;
    double apply(double price) const { return price * (1.0 - rate); }
};

struct DiscountFixed {
    double amount;
    double apply(double price) const { return std::max(0.0, price - amount); }
};

using PricingStrategy = std::variant<DiscountNone, DiscountPercent, DiscountFixed>;

double calculatePrice(double basePrice, const PricingStrategy& strategy) {
    return std::visit([basePrice](const auto& s) {
        return s.apply(basePrice);
    }, strategy);
}

int main() {
    // === std::function 策略 ===
    auto uppercase = [](const std::string& s) {
        std::string result = s;
        std::transform(result.begin(), result.end(), result.begin(), ::toupper);
        return result;
    };

    auto addBrackets = [](const std::string& s) {
        return "[" + s + "]";
    };

    auto snakeCase = [](const std::string& s) {
        std::string result;
        for (char c : s) {
            if (c == ' ') result += '_';
            else result += static_cast<char>(std::tolower(c));
        }
        return result;
    };

    TextFormatter formatter("demo", uppercase);
    std::cout << formatter.format("Hello World") << std::endl;

    formatter.setStrategy(addBrackets);
    std::cout << formatter.format("Hello World") << std::endl;

    formatter.setStrategy(snakeCase);
    std::cout << formatter.format("Hello World") << std::endl;

    // === std::variant 策略（定價） ===
    std::cout << "--- Pricing ---" << std::endl;
    double price = 100.0;

    PricingStrategy none = DiscountNone{};
    PricingStrategy percent = DiscountPercent{0.2};
    PricingStrategy fixed = DiscountFixed{15.0};

    std::cout << "Original: " << calculatePrice(price, none) << std::endl;
    std::cout << "20% off:  " << calculatePrice(price, percent) << std::endl;
    std::cout << "$15 off:  " << calculatePrice(price, fixed) << std::endl;

    return 0;
}`,
    exercise: {
      title: '策略模式練習',
      description: '實作一個可切換壓縮策略的系統：\n1. 定義三種「壓縮」策略（用字串模擬）：\n   - NoCompression: 原樣回傳\n   - RLE: 回傳 "RLE(<原字串>)"\n   - ZIP: 回傳 "ZIP(<原字串>)"\n2. 使用 std::function 作為策略\n3. 動態切換策略並輸出結果',
      starterCode: `#include <iostream>
#include <functional>
#include <string>

class Compressor {
    // TODO: 用 std::function 儲存策略
public:
    // TODO: setStrategy 和 compress 方法
};

int main() {
    Compressor c;
    std::string data = "HelloWorld";

    // TODO: 設定不同策略並輸出
    // NoCompression -> "HelloWorld"
    // RLE -> "RLE(HelloWorld)"
    // ZIP -> "ZIP(HelloWorld)"

    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: 'HelloWorld\nRLE(HelloWorld)\nZIP(HelloWorld)' }
      ],
      hints: [
        'std::function<std::string(const std::string&)> 作為策略型別',
        'NoCompression lambda: [](const std::string& s) { return s; }',
        'RLE lambda: [](const std::string& s) { return "RLE(" + s + ")"; }'
      ]
    }
  },
  {
    id: 'visitor-pattern',
    category: 'design-patterns',
    title: '訪問者模式 (Visitor)',
    description: '用 std::variant + std::visit 取代傳統的 double dispatch，實現簡潔的訪問者模式。',
    difficulty: 'advanced',
    content: `# 訪問者模式 (Visitor Pattern)

## 傳統問題

當你有一組不同型別的物件，想對它們執行不同操作，但不想在每個類別中加入新方法時，就需要 Visitor。

## 傳統 vs Modern C++

### 傳統做法：雙重分派 (Double Dispatch)

需要大量樣板程式碼：accept/visit 虛擬函式對。

### Modern C++：std::variant + std::visit

C++17 的 \`std::variant\` 搭配 \`std::visit\` 完美實現 Visitor，**零成本、型別安全、程式碼簡潔**：

\`\`\`cpp
using Shape = std::variant<Circle, Rectangle, Triangle>;

// Visitor 就是一個可呼叫物件
double area(const Shape& shape) {
    return std::visit([](const auto& s) { return s.area(); }, shape);
}
\`\`\`

## Overloaded Pattern

搭配 overloaded helper，可以對不同型別寫不同邏輯：

\`\`\`cpp
template<class... Ts> struct overloaded : Ts... { using Ts::operator()...; };
template<class... Ts> overloaded(Ts...) -> overloaded<Ts...>;

std::visit(overloaded{
    [](const Circle& c)    { /* ... */ },
    [](const Rectangle& r) { /* ... */ },
    [](const Triangle& t)  { /* ... */ },
}, shape);
\`\`\`

## 為什麼比傳統 Visitor 好？

| | 傳統 Visitor | variant + visit |
|---|---|---|
| 樣板程式碼 | 很多（accept/visit） | 幾乎沒有 |
| 效能 | 虛擬函式呼叫 | 編譯期分派，零成本 |
| 新增 Visitor | 容易 | 容易 |
| 新增型別 | 需改所有 Visitor | 編譯器會提醒（如果 visit 不完整） |
| 型別安全 | 弱 | 強（編譯期檢查） |

## 應用場景

- AST（抽象語法樹）處理
- 序列化/反序列化
- 圖形渲染
- 編譯器/直譯器
`,
    codeExample: `#include <iostream>
#include <variant>
#include <vector>
#include <string>
#include <cmath>
#include <numeric>

// Overloaded helper（C++17 經典工具）
template<class... Ts> struct overloaded : Ts... { using Ts::operator()...; };
template<class... Ts> overloaded(Ts...) -> overloaded<Ts...>;

// ====== AST 範例：簡易運算式求值 ======

struct Literal;
struct Add;
struct Multiply;

using Expr = std::variant<Literal, Add, Multiply>;

struct Literal {
    double value;
};

// 需要 unique_ptr 因為 variant 是遞迴結構
struct Add {
    std::shared_ptr<Expr> left, right;
};

struct Multiply {
    std::shared_ptr<Expr> left, right;
};

// Visitor 1: 求值
double evaluate(const Expr& expr) {
    return std::visit(overloaded{
        [](const Literal& lit) -> double {
            return lit.value;
        },
        [](const Add& add) -> double {
            return evaluate(*add.left) + evaluate(*add.right);
        },
        [](const Multiply& mul) -> double {
            return evaluate(*mul.left) * evaluate(*mul.right);
        },
    }, expr);
}

// Visitor 2: 轉字串
std::string to_string(const Expr& expr) {
    return std::visit(overloaded{
        [](const Literal& lit) -> std::string {
            // 去除尾部零
            std::string s = std::to_string(lit.value);
            s.erase(s.find_last_not_of('0') + 1, std::string::npos);
            if (s.back() == '.') s.pop_back();
            return s;
        },
        [](const Add& add) -> std::string {
            return "(" + to_string(*add.left) + " + " + to_string(*add.right) + ")";
        },
        [](const Multiply& mul) -> std::string {
            return "(" + to_string(*mul.left) + " * " + to_string(*mul.right) + ")";
        },
    }, expr);
}

// Helper
auto lit(double v) { return std::make_shared<Expr>(Literal{v}); }
auto add(std::shared_ptr<Expr> l, std::shared_ptr<Expr> r) {
    return std::make_shared<Expr>(Add{l, r});
}
auto mul(std::shared_ptr<Expr> l, std::shared_ptr<Expr> r) {
    return std::make_shared<Expr>(Multiply{l, r});
}

// ====== 形狀範例 ======

struct Circle { double radius; };
struct Rect { double w, h; };
struct Triangle { double base, height; };

using Shape = std::variant<Circle, Rect, Triangle>;

int main() {
    // AST: (3 + 4) * 2
    auto expr = Expr{Multiply{
        add(lit(3), lit(4)),
        lit(2)
    }};

    std::cout << "Expression: " << to_string(expr) << std::endl;
    std::cout << "Result: " << evaluate(expr) << std::endl;

    // 形狀 Visitor
    std::vector<Shape> shapes = {
        Circle{5.0},
        Rect{4.0, 6.0},
        Triangle{3.0, 8.0},
    };

    std::cout << "--- Shapes ---" << std::endl;
    for (const auto& shape : shapes) {
        // area visitor
        double area = std::visit(overloaded{
            [](const Circle& c)   { return M_PI * c.radius * c.radius; },
            [](const Rect& r)     { return r.w * r.h; },
            [](const Triangle& t) { return 0.5 * t.base * t.height; },
        }, shape);

        // name visitor
        std::string name = std::visit(overloaded{
            [](const Circle&)   { return std::string("Circle"); },
            [](const Rect&)     { return std::string("Rectangle"); },
            [](const Triangle&) { return std::string("Triangle"); },
        }, shape);

        std::cout << name << ": area=" << area << std::endl;
    }

    return 0;
}`,
    exercise: {
      title: '訪問者模式練習',
      description: '用 std::variant + std::visit 實作一個日誌系統的 Visitor：\n1. 定義三種日誌事件：InfoEvent{msg}, WarningEvent{msg, code}, ErrorEvent{msg, code, stackTrace}\n2. 實作 format visitor 將事件格式化為字串\n3. 輸出格式化結果',
      starterCode: `#include <iostream>
#include <variant>
#include <string>
#include <vector>

template<class... Ts> struct overloaded : Ts... { using Ts::operator()...; };
template<class... Ts> overloaded(Ts...) -> overloaded<Ts...>;

// TODO: 定義三種 Event struct

// TODO: 定義 LogEvent = std::variant<...>

// TODO: 實作 format 函式

int main() {
    // TODO: 建立事件並格式化
    // InfoEvent -> "[INFO] <msg>"
    // WarningEvent -> "[WARN-<code>] <msg>"
    // ErrorEvent -> "[ERROR-<code>] <msg> | <stackTrace>"

    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: '[INFO] Server started\n[WARN-301] Deprecated API call\n[ERROR-500] Null pointer | main.cpp:42' }
      ],
      hints: [
        '用 std::variant<InfoEvent, WarningEvent, ErrorEvent> 定義 LogEvent',
        '用 overloaded + std::visit 對每種型別寫不同的格式化邏輯',
        'ErrorEvent 需要三個欄位：msg, code, stackTrace'
      ]
    }
  },
  {
    id: 'crtp-pattern',
    category: 'design-patterns',
    title: 'CRTP 靜態多態',
    description: 'Curiously Recurring Template Pattern — 用模板實現編譯期多態，零成本取代虛擬函式。',
    difficulty: 'advanced',
    content: `# CRTP (Curiously Recurring Template Pattern)

## 概念

CRTP 是一種模板技巧，基底類別以衍生類別作為模板參數：

\`\`\`cpp
template<typename Derived>
class Base {
public:
    void interface() {
        static_cast<Derived*>(this)->implementation();
    }
};

class Concrete : public Base<Concrete> {
public:
    void implementation() { /* ... */ }
};
\`\`\`

## 為什麼使用 CRTP？

### 靜態多態（Static Polymorphism）

- 虛擬函式有 vtable 間接呼叫的成本
- CRTP 在編譯期就解析呼叫，**零額外開銷**
- 適合效能關鍵的程式碼（遊戲引擎、嵌入式系統、金融系統）

### 效能對比

\`\`\`
虛擬函式呼叫：載入 vtable → 查表 → 間接跳轉 → 執行
CRTP 呼叫：    直接內聯 → 執行（可被完全最佳化）
\`\`\`

## 常見用途

### 1. 靜態介面 (Static Interface)

\`\`\`cpp
template<typename Derived>
class Printable {
public:
    void print() const {
        std::cout << static_cast<const Derived*>(this)->to_string();
    }
};
\`\`\`

### 2. Mixin（混入功能）

\`\`\`cpp
template<typename Derived>
class Comparable {
public:
    bool operator>(const Derived& other) const {
        return other < static_cast<const Derived&>(*this);
    }
    bool operator>=(const Derived& other) const {
        return !(static_cast<const Derived&>(*this) < other);
    }
};
\`\`\`

### 3. 計數器 (Object Counter)

\`\`\`cpp
template<typename T>
class Counter {
    static inline int count_ = 0;
public:
    Counter() { ++count_; }
    ~Counter() { --count_; }
    static int count() { return count_; }
};
\`\`\`

## CRTP vs 虛擬函式 vs Concepts

| 特性 | 虛擬函式 | CRTP | Concepts (C++20) |
|------|---------|------|---------|
| 多態型別 | 執行期 | 編譯期 | 編譯期 |
| 效能開銷 | vtable 間接呼叫 | 零成本 | 零成本 |
| 可放入容器 | 可以 (base ptr) | 不行 (不同型別) | 不行 |
| 語法複雜度 | 低 | 中 | 低 |

## 何時使用 CRTP？

- 需要編譯期多態且效能重要時
- 提供 mixin 功能（可重用的行為）
- 不需要在同一個容器中混合不同型別時
- C++20 前的靜態介面（C++20 後考慮用 Concepts）
`,
    codeExample: `#include <iostream>
#include <string>
#include <vector>
#include <cmath>
#include <chrono>

// ====== CRTP 靜態多態 ======

// 靜態介面：Shape
template<typename Derived>
class ShapeBase {
public:
    double area() const {
        return static_cast<const Derived*>(this)->area_impl();
    }
    std::string name() const {
        return static_cast<const Derived*>(this)->name_impl();
    }
    void describe() const {
        std::cout << name() << ": area=" << area() << std::endl;
    }
};

class CRTPCircle : public ShapeBase<CRTPCircle> {
    double r_;
public:
    explicit CRTPCircle(double r) : r_(r) {}
    double area_impl() const { return M_PI * r_ * r_; }
    std::string name_impl() const { return "Circle(r=" + std::to_string(static_cast<int>(r_)) + ")"; }
};

class CRTPRect : public ShapeBase<CRTPRect> {
    double w_, h_;
public:
    CRTPRect(double w, double h) : w_(w), h_(h) {}
    double area_impl() const { return w_ * h_; }
    std::string name_impl() const { return "Rect(" + std::to_string(static_cast<int>(w_)) + "x" + std::to_string(static_cast<int>(h_)) + ")"; }
};

// ====== CRTP Mixin：Comparable ======

template<typename Derived>
class Comparable {
public:
    bool operator!=(const Derived& other) const {
        return !(static_cast<const Derived&>(*this) == other);
    }
    bool operator>(const Derived& other) const {
        return other < static_cast<const Derived&>(*this);
    }
    bool operator<=(const Derived& other) const {
        return !(static_cast<const Derived&>(*this) > other);
    }
    bool operator>=(const Derived& other) const {
        return !(static_cast<const Derived&>(*this) < other);
    }
};

class Temperature : public Comparable<Temperature> {
    double value_;
public:
    explicit Temperature(double v) : value_(v) {}
    double value() const { return value_; }
    bool operator==(const Temperature& other) const { return value_ == other.value_; }
    bool operator<(const Temperature& other) const { return value_ < other.value_; }
};

// ====== CRTP Object Counter ======

template<typename T>
class ObjectCounter {
    static inline int count_ = 0;
public:
    ObjectCounter() { ++count_; }
    ObjectCounter(const ObjectCounter&) { ++count_; }
    ~ObjectCounter() { --count_; }
    static int alive() { return count_; }
};

class Widget : public ObjectCounter<Widget> {
    std::string name_;
public:
    Widget(std::string name) : name_(std::move(name)) {}
};

class Gadget : public ObjectCounter<Gadget> {
    int id_;
public:
    Gadget(int id) : id_(id) {}
};

int main() {
    // 靜態多態
    CRTPCircle c(5.0);
    CRTPRect r(4.0, 6.0);
    c.describe();
    r.describe();

    // Mixin: Comparable
    Temperature hot(100.0), cold(0.0), warm(37.0);
    std::cout << "--- Temperature ---" << std::endl;
    std::cout << "100 > 0: " << (hot > cold ? "true" : "false") << std::endl;
    std::cout << "37 <= 100: " << (warm <= hot ? "true" : "false") << std::endl;
    std::cout << "0 >= 37: " << (cold >= warm ? "true" : "false") << std::endl;

    // Object Counter
    std::cout << "--- Counter ---" << std::endl;
    {
        Widget w1("A"), w2("B"), w3("C");
        Gadget g1(1);
        std::cout << "Widgets alive: " << Widget::alive() << std::endl;
        std::cout << "Gadgets alive: " << Gadget::alive() << std::endl;
    }
    std::cout << "Widgets alive: " << Widget::alive() << std::endl;
    std::cout << "Gadgets alive: " << Gadget::alive() << std::endl;

    return 0;
}`,
    exercise: {
      title: 'CRTP 練習',
      description: '使用 CRTP 實作一個 Serializable mixin：\n1. 基底 CRTP 類別提供 serialize() 方法\n2. serialize() 呼叫衍生類別的 to_json_impl()\n3. 實作 User 和 Product 兩個可序列化的類別\n4. 輸出 JSON 字串',
      starterCode: `#include <iostream>
#include <string>

// TODO: 實作 Serializable CRTP 基底類別

// TODO: 實作 User : Serializable<User>
// User 有 name 和 age
// to_json_impl 回傳 {"name":"<name>","age":<age>}

// TODO: 實作 Product : Serializable<Product>
// Product 有 title 和 price
// to_json_impl 回傳 {"title":"<title>","price":<price>}

int main() {
    User u("Alice", 30);
    Product p("Laptop", 999);

    std::cout << u.serialize() << std::endl;
    std::cout << p.serialize() << std::endl;

    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: '{"name":"Alice","age":30}\n{"title":"Laptop","price":999}' }
      ],
      hints: [
        'template<typename Derived> class Serializable',
        'serialize() 呼叫 static_cast<const Derived*>(this)->to_json_impl()',
        '用 std::to_string 將數字轉字串'
      ]
    }
  },

  // ===== MORE SYSTEM PROGRAMMING =====
  {
    id: 'thread-pool',
    category: 'system-programming',
    title: '執行緒池 (Thread Pool)',
    description: '實作一個實用的執行緒池，避免頻繁建立/銷毀執行緒的開銷。',
    difficulty: 'advanced',
    content: `# 執行緒池 (Thread Pool)

## 為什麼需要執行緒池？

- 建立/銷毀執行緒有顯著的系統開銷
- 無限制建立執行緒可能耗盡系統資源
- 執行緒池維護一組工作執行緒，重複利用

## 核心元件

1. **工作佇列 (Task Queue)**：存放待執行的任務
2. **工作執行緒 (Worker Threads)**：從佇列取出任務執行
3. **同步機制**：mutex + condition_variable

## 設計要點

\`\`\`
ThreadPool
├── workers_: vector<thread>     // 工作執行緒
├── tasks_: queue<function>      // 任務佇列
├── mutex_                       // 保護佇列
├── cv_                          // 通知工作者
├── stop_                        // 停止旗標
├── submit(task) -> future       // 提交任務
└── ~ThreadPool()                // 等待所有任務完成
\`\`\`

## 關鍵技術

- \`std::packaged_task\` 包裝任務，取得 future
- \`std::condition_variable\` 讓工作者等待新任務
- \`std::shared_ptr\` 管理 packaged_task 的生命週期
- RAII 確保執行緒池正確關閉

## Best Practice

- 執行緒數量通常設為 \`std::thread::hardware_concurrency()\`
- 任務應該是獨立的，避免任務間的依賴
- 避免在任務中持有鎖太久
`,
    codeExample: `#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <future>
#include <numeric>
#include <cmath>

class ThreadPool {
    std::vector<std::thread> workers_;
    std::queue<std::function<void()>> tasks_;
    std::mutex mutex_;
    std::condition_variable cv_;
    bool stop_ = false;

public:
    explicit ThreadPool(size_t numThreads) {
        for (size_t i = 0; i < numThreads; ++i) {
            workers_.emplace_back([this] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(mutex_);
                        cv_.wait(lock, [this] {
                            return stop_ || !tasks_.empty();
                        });
                        if (stop_ && tasks_.empty()) return;
                        task = std::move(tasks_.front());
                        tasks_.pop();
                    }
                    task();
                }
            });
        }
    }

    ~ThreadPool() {
        {
            std::lock_guard<std::mutex> lock(mutex_);
            stop_ = true;
        }
        cv_.notify_all();
        for (auto& worker : workers_) {
            worker.join();
        }
    }

    template<typename F, typename... Args>
    auto submit(F&& f, Args&&... args)
        -> std::future<std::invoke_result_t<F, Args...>>
    {
        using ReturnType = std::invoke_result_t<F, Args...>;

        auto task = std::make_shared<std::packaged_task<ReturnType()>>(
            std::bind(std::forward<F>(f), std::forward<Args>(args)...)
        );

        std::future<ReturnType> result = task->get_future();
        {
            std::lock_guard<std::mutex> lock(mutex_);
            tasks_.emplace([task]() { (*task)(); });
        }
        cv_.notify_one();
        return result;
    }
};

// 模擬耗時計算
bool is_prime(long long n) {
    if (n < 2) return false;
    for (long long i = 2; i * i <= n; ++i) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    const size_t numThreads = std::thread::hardware_concurrency();
    std::cout << "Thread pool size: " << numThreads << std::endl;

    ThreadPool pool(numThreads > 0 ? numThreads : 4);

    // 提交多個質數檢查任務
    std::vector<std::pair<long long, std::future<bool>>> results;
    std::vector<long long> numbers = {
        999999937, 999999893, 999999883, 999999877,
        1000000007, 1000000009, 100, 200
    };

    for (auto n : numbers) {
        auto future = pool.submit(is_prime, n);
        results.emplace_back(n, std::move(future));
    }

    // 收集結果
    for (auto& [num, future] : results) {
        bool prime = future.get();
        std::cout << num << " is " << (prime ? "prime" : "not prime") << std::endl;
    }

    // 提交計算任務
    std::cout << "--- Computation ---" << std::endl;
    auto sum_future = pool.submit([]() {
        long long sum = 0;
        for (long long i = 1; i <= 1000000; ++i) sum += i;
        return sum;
    });
    std::cout << "Sum 1..1000000 = " << sum_future.get() << std::endl;

    return 0;
}`,
    exercise: {
      title: '執行緒池練習',
      description: '使用執行緒池並行計算多個區間的累加和：\n1. 將 1 到 N 分成 4 個區間\n2. 每個區間提交到執行緒池計算\n3. 合併結果輸出總和',
      starterCode: `#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <future>

// TODO: 實作 ThreadPool 類別（可簡化版）

long long range_sum(long long start, long long end) {
    long long sum = 0;
    for (long long i = start; i <= end; ++i) sum += i;
    return sum;
}

int main() {
    long long n;
    std::cin >> n;

    // TODO: 建立執行緒池
    // TODO: 將 1..n 分成 4 段提交
    // TODO: 合併結果並輸出

    return 0;
}`,
      testCases: [
        { input: '100', expectedOutput: '5050' },
        { input: '1000000', expectedOutput: '500000500000' }
      ],
      hints: [
        '區間劃分: chunk = n / 4',
        '四個任務: [1, chunk], [chunk+1, 2*chunk], ...',
        '用 future.get() 取得各區間結果後加總'
      ]
    }
  },
  {
    id: 'atomic-lock-free',
    category: 'system-programming',
    title: '原子操作與無鎖程式設計',
    description: '使用 std::atomic 實現無鎖資料結構，避免 mutex 的開銷。',
    difficulty: 'advanced',
    content: `# 原子操作與無鎖程式設計

## 為什麼需要原子操作？

- mutex 有加鎖/解鎖的開銷
- mutex 可能導致執行緒阻塞和上下文切換
- 對於簡單的計數器或旗標，atomic 更高效

## std::atomic

\`\`\`cpp
std::atomic<int> counter{0};
counter.fetch_add(1);   // 原子加法
counter.load();         // 原子讀取
counter.store(42);      // 原子寫入
counter.compare_exchange_strong(expected, desired); // CAS
\`\`\`

## 記憶體順序 (Memory Order)

控制原子操作的可見性保證：

- \`memory_order_seq_cst\` — 預設，最嚴格（順序一致）
- \`memory_order_acquire\` — 讀取端保證
- \`memory_order_release\` — 寫入端保證
- \`memory_order_relaxed\` — 最寬鬆，只保證原子性

## CAS (Compare-And-Swap)

無鎖程式設計的核心操作：

\`\`\`cpp
bool compare_exchange_strong(T& expected, T desired);
// 如果 *this == expected，則設為 desired，回傳 true
// 否則，expected = *this，回傳 false
\`\`\`

## 無鎖 Stack 的基本概念

\`\`\`cpp
// push: 用 CAS loop
void push(T value) {
    Node* new_node = new Node{value};
    new_node->next = head_.load();
    while (!head_.compare_exchange_weak(new_node->next, new_node));
}
\`\`\`

## Best Practice

- 簡單計數/旗標用 atomic
- 複雜資料結構的無鎖實作要非常小心
- 優先使用 \`seq_cst\`，只在效能瓶頸時考慮更弱的 order
- 無鎖不代表無等待（lock-free ≠ wait-free）
`,
    codeExample: `#include <iostream>
#include <atomic>
#include <thread>
#include <vector>
#include <chrono>
#include <functional>

// ====== 原子計數器 vs mutex 計數器 ======

class AtomicCounter {
    std::atomic<long long> count_{0};
public:
    void increment() { count_.fetch_add(1, std::memory_order_relaxed); }
    long long get() const { return count_.load(std::memory_order_relaxed); }
};

class MutexCounter {
    long long count_ = 0;
    std::mutex mutex_;
public:
    void increment() {
        std::lock_guard<std::mutex> lock(mutex_);
        ++count_;
    }
    long long get() const { return count_; }
};

// ====== Spinlock（自旋鎖）======

class Spinlock {
    std::atomic_flag flag_ = ATOMIC_FLAG_INIT;
public:
    void lock() {
        while (flag_.test_and_set(std::memory_order_acquire)) {
            // 自旋等待
        }
    }
    void unlock() {
        flag_.clear(std::memory_order_release);
    }
};

// ====== 無鎖 SPSC 佇列概念（Single Producer Single Consumer）======

template<typename T, size_t Capacity>
class SPSCQueue {
    std::array<T, Capacity> buffer_;
    std::atomic<size_t> head_{0};
    std::atomic<size_t> tail_{0};

public:
    bool push(const T& value) {
        size_t tail = tail_.load(std::memory_order_relaxed);
        size_t next = (tail + 1) % Capacity;
        if (next == head_.load(std::memory_order_acquire))
            return false; // 滿了
        buffer_[tail] = value;
        tail_.store(next, std::memory_order_release);
        return true;
    }

    bool pop(T& value) {
        size_t head = head_.load(std::memory_order_relaxed);
        if (head == tail_.load(std::memory_order_acquire))
            return false; // 空的
        value = buffer_[head];
        head_.store((head + 1) % Capacity, std::memory_order_release);
        return true;
    }
};

template<typename Counter>
long long benchmark(const std::string& name, int numThreads, int opsPerThread) {
    Counter counter;
    auto start = std::chrono::high_resolution_clock::now();

    std::vector<std::thread> threads;
    for (int i = 0; i < numThreads; ++i) {
        threads.emplace_back([&counter, opsPerThread]() {
            for (int j = 0; j < opsPerThread; ++j) {
                counter.increment();
            }
        });
    }
    for (auto& t : threads) t.join();

    auto end = std::chrono::high_resolution_clock::now();
    auto us = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();
    std::cout << name << ": " << counter.get()
              << " (time: " << us << "us)" << std::endl;
    return counter.get();
}

int main() {
    const int threads = 4;
    const int ops = 100000;

    std::cout << "=== Counter Benchmark ===" << std::endl;
    benchmark<AtomicCounter>("Atomic ", threads, ops);
    benchmark<MutexCounter>("Mutex  ", threads, ops);

    // SPSC Queue 範例
    std::cout << "=== SPSC Queue ===" << std::endl;
    SPSCQueue<int, 1024> queue;
    std::atomic<long long> sum{0};

    std::thread producer([&queue]() {
        for (int i = 1; i <= 100; ++i) {
            while (!queue.push(i)) {} // 重試直到成功
        }
    });

    std::thread consumer([&queue, &sum]() {
        for (int i = 0; i < 100; ++i) {
            int value;
            while (!queue.pop(value)) {} // 重試直到有資料
            sum.fetch_add(value);
        }
    });

    producer.join();
    consumer.join();
    std::cout << "SPSC sum: " << sum.load() << std::endl;

    // atomic_flag spinlock
    std::cout << "=== Spinlock ===" << std::endl;
    Spinlock spinlock;
    int shared_value = 0;

    std::vector<std::thread> workers;
    for (int i = 0; i < 4; ++i) {
        workers.emplace_back([&]() {
            for (int j = 0; j < 10000; ++j) {
                spinlock.lock();
                ++shared_value;
                spinlock.unlock();
            }
        });
    }
    for (auto& w : workers) w.join();
    std::cout << "Spinlock result: " << shared_value << std::endl;

    return 0;
}`,
    exercise: {
      title: '原子操作練習',
      description: '實作一個 thread-safe 的原子統計器：\n1. 用 atomic 追蹤 min, max, sum, count\n2. 多執行緒同時提交數值\n3. 最後輸出統計結果',
      starterCode: `#include <iostream>
#include <atomic>
#include <thread>
#include <vector>
#include <climits>

class AtomicStats {
    std::atomic<long long> sum_{0};
    std::atomic<int> count_{0};
    std::atomic<int> min_{INT_MAX};
    std::atomic<int> max_{INT_MIN};
public:
    void record(int value) {
        sum_.fetch_add(value);
        count_.fetch_add(1);

        // TODO: 用 CAS loop 更新 min_
        // TODO: 用 CAS loop 更新 max_
    }

    void print() const {
        std::cout << "Count: " << count_.load() << std::endl;
        std::cout << "Sum: " << sum_.load() << std::endl;
        std::cout << "Min: " << min_.load() << std::endl;
        std::cout << "Max: " << max_.load() << std::endl;
    }
};

int main() {
    AtomicStats stats;

    std::vector<std::thread> threads;
    for (int t = 0; t < 4; ++t) {
        threads.emplace_back([&stats, t]() {
            for (int i = 1; i <= 25; ++i) {
                stats.record(t * 25 + i);
            }
        });
    }
    for (auto& th : threads) th.join();

    stats.print();
    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: 'Count: 100\nSum: 5050\nMin: 1\nMax: 100' }
      ],
      hints: [
        'CAS loop: int old = min_.load(); while (value < old && !min_.compare_exchange_weak(old, value));',
        'compare_exchange_weak 失敗時會自動更新 old 為當前值',
        'max_ 的邏輯類似但方向相反'
      ]
    }
  },
  {
    id: 'coroutines-cpp20',
    category: 'system-programming',
    title: 'C++20 協程 (Coroutines)',
    description: '使用 co_yield、co_return、co_await 實現惰性生成器與非同步流程。',
    difficulty: 'advanced',
    content: `# C++20 協程 (Coroutines)

## 概念

協程是可以**暫停和恢復**執行的函式。與普通函式不同，協程可以在中途暫停，讓出控制權，之後再從暫停處繼續。

## 三個關鍵字

- \`co_yield value\` — 產出一個值並暫停
- \`co_return value\` — 回傳最終值並結束
- \`co_await expr\` — 等待某個非同步操作完成

只要函式體中出現這三個關鍵字之一，編譯器就會將它視為協程。

## Generator（惰性生成器）

最常見的協程用途 — 惰性產生一系列值：

\`\`\`cpp
Generator<int> fibonacci() {
    int a = 0, b = 1;
    while (true) {
        co_yield a;
        auto next = a + b;
        a = b;
        b = next;
    }
}
\`\`\`

## Promise Type

協程需要一個 promise_type 來控制行為：

\`\`\`
Generator<T>
├── promise_type
│   ├── get_return_object()     // 建立 Generator
│   ├── initial_suspend()       // 開始時暫停？
│   ├── final_suspend()         // 結束時暫停？
│   ├── yield_value(T)          // 處理 co_yield
│   └── return_void()           // 處理 co_return
└── handle_: coroutine_handle   // 控制協程的 handle
\`\`\`

## 注意事項

- 協程機制是底層的，通常需要自定義 Generator 類別
- C++23 的 \`std::generator\` 提供標準化的生成器（部分編譯器已支援）
- 協程本身不是多執行緒，但可以搭配使用
`,
    codeExample: `#include <iostream>
#include <coroutine>
#include <optional>
#include <vector>
#include <string>

// ====== Generator 類別 ======
template<typename T>
class Generator {
public:
    struct promise_type {
        T current_value;

        Generator get_return_object() {
            return Generator{
                std::coroutine_handle<promise_type>::from_promise(*this)
            };
        }

        std::suspend_always initial_suspend() { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }

        std::suspend_always yield_value(T value) {
            current_value = std::move(value);
            return {};
        }

        void return_void() {}
        void unhandled_exception() { std::terminate(); }
    };

    using Handle = std::coroutine_handle<promise_type>;

    explicit Generator(Handle h) : handle_(h) {}
    ~Generator() { if (handle_) handle_.destroy(); }

    // 禁止拷貝
    Generator(const Generator&) = delete;
    Generator& operator=(const Generator&) = delete;

    // 允許移動
    Generator(Generator&& other) noexcept : handle_(other.handle_) {
        other.handle_ = nullptr;
    }

    bool next() {
        if (!handle_ || handle_.done()) return false;
        handle_.resume();
        return !handle_.done();
    }

    T value() const { return handle_.promise().current_value; }

private:
    Handle handle_;
};

// ====== 各種 Generator 範例 ======

// Fibonacci 數列
Generator<long long> fibonacci(int count) {
    long long a = 0, b = 1;
    for (int i = 0; i < count; ++i) {
        co_yield a;
        auto next = a + b;
        a = b;
        b = next;
    }
}

// Range 生成器
Generator<int> range(int start, int end, int step = 1) {
    for (int i = start; i < end; i += step) {
        co_yield i;
    }
}

// 過濾生成器
Generator<int> filter_even(Generator<int> gen) {
    while (gen.next()) {
        int v = gen.value();
        if (v % 2 == 0) {
            co_yield v;
        }
    }
}

// 字串分割生成器
Generator<std::string> split(const std::string& s, char delimiter) {
    std::string token;
    for (char c : s) {
        if (c == delimiter) {
            if (!token.empty()) {
                co_yield token;
                token.clear();
            }
        } else {
            token += c;
        }
    }
    if (!token.empty()) {
        co_yield token;
    }
}

int main() {
    // Fibonacci
    std::cout << "Fibonacci: ";
    auto fib = fibonacci(10);
    while (fib.next()) {
        std::cout << fib.value() << " ";
    }
    std::cout << std::endl;

    // Range
    std::cout << "Range(0,10,2): ";
    auto r = range(0, 10, 2);
    while (r.next()) {
        std::cout << r.value() << " ";
    }
    std::cout << std::endl;

    // Filter
    std::cout << "Even in 1..20: ";
    auto evens = filter_even(range(1, 21));
    while (evens.next()) {
        std::cout << evens.value() << " ";
    }
    std::cout << std::endl;

    // Split
    std::cout << "Split: ";
    auto tokens = split("Hello,World,Modern,CPP", ',');
    while (tokens.next()) {
        std::cout << "[" << tokens.value() << "] ";
    }
    std::cout << std::endl;

    return 0;
}`,
    exercise: {
      title: '協程 Generator 練習',
      description: '使用上面的 Generator 類別，實作：\n1. 一個 squares 生成器：產出 1, 4, 9, 16, 25...\n2. 一個 take 生成器：從另一個生成器取前 N 個值\n3. 組合使用並輸出前 5 個平方數',
      starterCode: `#include <iostream>
#include <coroutine>

// Generator 類別（同上面的範例）
template<typename T>
class Generator {
public:
    struct promise_type {
        T current_value;
        Generator get_return_object() {
            return Generator{std::coroutine_handle<promise_type>::from_promise(*this)};
        }
        std::suspend_always initial_suspend() { return {}; }
        std::suspend_always final_suspend() noexcept { return {}; }
        std::suspend_always yield_value(T value) {
            current_value = std::move(value);
            return {};
        }
        void return_void() {}
        void unhandled_exception() { std::terminate(); }
    };

    using Handle = std::coroutine_handle<promise_type>;
    explicit Generator(Handle h) : handle_(h) {}
    ~Generator() { if (handle_) handle_.destroy(); }
    Generator(const Generator&) = delete;
    Generator(Generator&& o) noexcept : handle_(o.handle_) { o.handle_ = nullptr; }
    bool next() { if (!handle_ || handle_.done()) return false; handle_.resume(); return !handle_.done(); }
    T value() const { return handle_.promise().current_value; }
private:
    Handle handle_;
};

// TODO: 實作 squares() 生成器（無限）
// TODO: 實作 take(Generator<T>, n) 生成器

int main() {
    auto result = take(squares(), 5);
    bool first = true;
    while (result.next()) {
        if (!first) std::cout << " ";
        std::cout << result.value();
        first = false;
    }
    std::cout << std::endl;
    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: '1 4 9 16 25' }
      ],
      hints: [
        'squares: for (int i = 1; ; ++i) co_yield i * i;',
        'take: 迴圈 n 次，每次 gen.next() 後 co_yield gen.value()',
        '無限生成器 + take 組合是協程的經典用法'
      ]
    }
  },
  {
    id: 'memory-model-alignment',
    category: 'system-programming',
    title: '記憶體管理與 Allocator',
    description: '深入理解 C++ 記憶體模型、自定義 Allocator、記憶體對齊與 placement new。',
    difficulty: 'advanced',
    content: `# 記憶體管理與 Allocator

## C++ 記憶體區域

- **Stack（堆疊）**：區域變數，自動管理，速度最快
- **Heap（堆積）**：動態配置 (new/delete)，需要手動或 RAII 管理
- **Static/Global**：全域/靜態變數
- **Thread-local**：每個執行緒獨立的儲存

## alignas 與 alignof

C++11 提供明確控制記憶體對齊：

\`\`\`cpp
struct alignas(64) CacheLine {
    int data[16]; // 對齊到 64 bytes（CPU 快取行）
};
std::cout << alignof(CacheLine); // 64
\`\`\`

## placement new

在指定的記憶體位置建構物件：

\`\`\`cpp
alignas(T) unsigned char buffer[sizeof(T)];
T* obj = new (buffer) T(args...);
obj->~T(); // 手動呼叫解構函式
\`\`\`

## 自定義 Allocator

STL 容器可以使用自定義的配置器：

\`\`\`cpp
template<typename T>
class PoolAllocator {
    // ...
    T* allocate(size_t n);
    void deallocate(T* p, size_t n);
};

std::vector<int, PoolAllocator<int>> vec;
\`\`\`

## 記憶體池 (Memory Pool)

- 預先配置一大塊記憶體
- 從池中分配/回收小塊記憶體
- 避免頻繁的系統呼叫
- 減少記憶體碎片

## Best Practice

- 理解你的資料在記憶體中的佈局（cache friendly）
- 對效能關鍵的資料結構使用對齊
- 頻繁配置/釋放小物件時考慮記憶體池
- 使用 PMR (Polymorphic Memory Resource, C++17) 簡化自定義配置
`,
    codeExample: `#include <iostream>
#include <vector>
#include <memory>
#include <cstddef>
#include <new>
#include <chrono>
#include <array>

// ====== 記憶體對齊 ======

struct Normal {
    char a;    // 1 byte
    int b;     // 4 bytes
    char c;    // 1 byte
};  // sizeof = 12 (有 padding)

struct Packed {
    int b;     // 4 bytes
    char a;    // 1 byte
    char c;    // 1 byte
};  // sizeof = 8 (更緊湊)

struct alignas(64) CacheAligned {
    int data[4];
};

// ====== 簡易記憶體池 ======

template<typename T, size_t PoolSize = 1024>
class SimplePool {
    union Block {
        T data;
        Block* next;
        Block() {}
        ~Block() {}
    };

    std::array<Block, PoolSize> pool_;
    Block* free_list_ = nullptr;
    size_t allocated_ = 0;

public:
    SimplePool() {
        // 建立 free list
        for (size_t i = 0; i < PoolSize - 1; ++i) {
            pool_[i].next = &pool_[i + 1];
        }
        pool_[PoolSize - 1].next = nullptr;
        free_list_ = &pool_[0];
    }

    T* allocate() {
        if (!free_list_) return nullptr;
        Block* block = free_list_;
        free_list_ = block->next;
        ++allocated_;
        return reinterpret_cast<T*>(block);
    }

    void deallocate(T* ptr) {
        Block* block = reinterpret_cast<Block*>(ptr);
        block->next = free_list_;
        free_list_ = block;
        --allocated_;
    }

    size_t allocated() const { return allocated_; }
    size_t capacity() const { return PoolSize; }
};

// ====== Placement New 範例 ======

class Sensor {
    int id_;
    double value_;
public:
    Sensor(int id, double val) : id_(id), value_(val) {
        std::cout << "Sensor " << id_ << " constructed (val=" << value_ << ")" << std::endl;
    }
    ~Sensor() {
        std::cout << "Sensor " << id_ << " destroyed" << std::endl;
    }
    void read() const {
        std::cout << "Sensor " << id_ << ": " << value_ << std::endl;
    }
};

int main() {
    // 記憶體佈局
    std::cout << "=== Memory Layout ===" << std::endl;
    std::cout << "sizeof(Normal): " << sizeof(Normal) << std::endl;
    std::cout << "sizeof(Packed): " << sizeof(Packed) << std::endl;
    std::cout << "sizeof(CacheAligned): " << sizeof(CacheAligned) << std::endl;
    std::cout << "alignof(CacheAligned): " << alignof(CacheAligned) << std::endl;

    // 記憶體池
    std::cout << "=== Memory Pool ===" << std::endl;
    SimplePool<int, 100> pool;

    std::vector<int*> ptrs;
    for (int i = 0; i < 5; ++i) {
        int* p = pool.allocate();
        *p = i * 10;
        ptrs.push_back(p);
    }

    std::cout << "Allocated: " << pool.allocated() << std::endl;
    for (auto* p : ptrs) {
        std::cout << *p << " ";
    }
    std::cout << std::endl;

    for (auto* p : ptrs) pool.deallocate(p);
    std::cout << "After free: " << pool.allocated() << std::endl;

    // Placement new
    std::cout << "=== Placement New ===" << std::endl;
    alignas(Sensor) unsigned char buffer[sizeof(Sensor) * 2];

    Sensor* s1 = new (buffer) Sensor(1, 23.5);
    Sensor* s2 = new (buffer + sizeof(Sensor)) Sensor(2, 37.8);

    s1->read();
    s2->read();

    // 手動解構（反序）
    s2->~Sensor();
    s1->~Sensor();

    return 0;
}`,
    exercise: {
      title: '記憶體管理練習',
      description: '實作一個固定大小的 Stack Allocator：\n1. 預先配置一塊固定大小的記憶體 (buffer)\n2. 用 offset 追蹤已使用的位置\n3. allocate(n) 回傳 n bytes 的指標\n4. reset() 重置 offset 為 0\n5. 測試並輸出配置結果',
      starterCode: `#include <iostream>
#include <cstddef>
#include <new>

class StackAllocator {
    unsigned char* buffer_;
    size_t capacity_;
    size_t offset_ = 0;
public:
    StackAllocator(size_t capacity)
        : buffer_(new unsigned char[capacity]), capacity_(capacity) {}
    ~StackAllocator() { delete[] buffer_; }

    // TODO: 實作 allocate(size_t bytes) -> void*
    // 回傳目前 offset 位置的指標，並前進 offset
    // 如果空間不足回傳 nullptr

    // TODO: 實作 reset()

    size_t used() const { return offset_; }
    size_t capacity() const { return capacity_; }
};

int main() {
    StackAllocator alloc(256);

    // 配置 3 個 int
    int* a = static_cast<int*>(alloc.allocate(sizeof(int)));
    int* b = static_cast<int*>(alloc.allocate(sizeof(int)));
    int* c = static_cast<int*>(alloc.allocate(sizeof(int)));

    *a = 10; *b = 20; *c = 30;
    std::cout << *a << " " << *b << " " << *c << std::endl;
    std::cout << "Used: " << alloc.used() << std::endl;

    alloc.reset();
    std::cout << "After reset: " << alloc.used() << std::endl;

    return 0;
}`,
      testCases: [
        { input: '', expectedOutput: '10 20 30\nUsed: 12\nAfter reset: 0' }
      ],
      hints: [
        'allocate: 檢查 offset_ + bytes <= capacity_',
        '回傳 buffer_ + offset_ 並更新 offset_ += bytes',
        'reset: offset_ = 0'
      ]
    }
  },
];
