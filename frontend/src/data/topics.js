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

## 尾端回傳型別 (Trailing Return Type)

C++11 引入了尾端回傳型別語法，搭配 \`auto\` 和 \`decltype\` 使用：

\`\`\`cpp
// 傳統寫法無法在回傳型別處引用參數
// 尾端回傳型別解決此問題
template<typename T, typename U>
auto add(T a, U b) -> decltype(a + b) {
    return a + b;
}
\`\`\`

C++14 之後編譯器可自動推導回傳型別，很多情況可省略尾端回傳型別：

\`\`\`cpp
// C++14: 自動推導回傳型別
template<typename T, typename U>
auto add(T a, U b) {
    return a + b;
}
\`\`\`

但尾端回傳型別在需要 SFINAE 或明確表達意圖時仍然有用。

## decltype(auto) — C++14

\`decltype(auto)\` 結合了 \`auto\` 的便利和 \`decltype\` 的精確型別保留：

\`\`\`cpp
int x = 42;
int& rx = x;

auto a = rx;            // int（auto 去掉引用）
decltype(auto) b = rx;  // int&（保留引用！）

// 最常用於完美轉發回傳值
template<typename F, typename... Args>
decltype(auto) wrapper(F&& f, Args&&... args) {
    return std::forward<F>(f)(std::forward<Args>(args)...);
}
\`\`\`

**注意**：\`decltype(auto)\` 對括號非常敏感！

\`\`\`cpp
int x = 42;
decltype(auto) a = x;    // int
decltype(auto) b = (x);  // int& ← 加括號變成引用，非常危險！
\`\`\`

## auto 用於函式參數 (C++20)

C++20 允許在普通函式中使用 \`auto\` 作為參數型別，等同於隱式模板：

\`\`\`cpp
// C++20: abbreviated function template
void print(const auto& value) {
    std::cout << value << std::endl;
}
// 等價於：
// template<typename T>
// void print(const T& value) { ... }

// 多個 auto 參數各自獨立推導
auto add(auto a, auto b) {
    return a + b;
}
// 等價於 template<typename T, typename U> auto add(T a, U b)
\`\`\`

## 何時**不該**使用 auto

雖然 \`auto\` 很方便，但以下情況應避免使用：

1. **型別不明顯時** — 降低可讀性：
\`\`\`cpp
auto result = compute();  // result 是什麼型別？不清楚
int result = compute();   // 明確知道是 int
\`\`\`

2. **需要特定型別轉換時**：
\`\`\`cpp
auto size = vec.size();  // size_t（無號整數）
int size = vec.size();   // 如果需要有號整數
\`\`\`

3. **代理物件 (proxy objects)**：
\`\`\`cpp
std::vector<bool> flags = {true, false, true};
auto val = flags[0];    // 不是 bool！是 vector<bool>::reference
bool val = flags[0];    // 才是真正的 bool
\`\`\`

4. **初始化列表的型別歧義**：
\`\`\`cpp
auto x = {1, 2, 3};  // std::initializer_list<int>，不是 vector！
auto y = {1};         // C++11/14: initializer_list<int>
auto z{1};            // C++17 起才是 int
\`\`\`

## 常見陷阱

- 不要對未初始化的變數使用 \`auto\`
- \`auto\` 會拷貝物件，需要引用時記得加 \`&\`
- \`decltype((x))\` 與 \`decltype(x)\` 結果不同（加括號會變成引用）
- \`auto\` 搭配大括號初始化行為在不同標準版本有差異

## Best Practice

- 當型別明顯時使用 \`auto\` 提高可讀性
- 複雜的模板型別優先使用 \`auto\`
- 需要精確型別控制時使用 \`decltype\`
- 需要保留引用和 cv 限定符時考慮 \`decltype(auto)\`
- 避免對 \`vector<bool>\` 的元素使用 \`auto\`
- C++20 中善用 \`auto\` 參數簡化模板函式
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
      ],
      solution: `#include <iostream>
#include <vector>
#include <string>
#include <utility>

int main() {
    std::vector<std::pair<std::string, int>> students = {
        {"Alice", 85}, {"Bob", 92}, {"Charlie", 78}, {"Diana", 95}
    };

    auto best = students[0];
    for (const auto& s : students) {
        if (s.second > best.second) {
            best = s;
        }
    }

    std::cout << "Best: " << best.first << " " << best.second << std::endl;

    return 0;
}`
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

## 內部運作原理：begin() / end()

Range-based for 迴圈實際上是語法糖。編譯器會將它展開為：

\`\`\`cpp
// for (auto& elem : container) { body; }
// 等價於：
{
    auto&& __range = container;
    auto __begin = std::begin(__range);
    auto __end = std::end(__range);
    for (; __begin != __end; ++__begin) {
        auto& elem = *__begin;
        body;
    }
}
\`\`\`

理解這個展開很重要，因為：
- **不能在迴圈中修改容器大小**（會導致迭代器失效）
- 容器需要提供 \\\`begin()\\\` 和 \\\`end()\\\`
- expression 只會被求值一次

## 讓自定義類別支援 Range-based for

你的類別只需提供 \\\`begin()\\\` 和 \\\`end()\\\` 方法：

\`\`\`cpp
class IntRange {
    int start_, end_;
public:
    IntRange(int s, int e) : start_(s), end_(e) {}

    struct Iterator {
        int current;
        int operator*() const { return current; }
        Iterator& operator++() { ++current; return *this; }
        bool operator!=(const Iterator& o) const {
            return current != o.current;
        }
    };

    Iterator begin() const { return {start_}; }
    Iterator end() const { return {end_}; }
};

// 使用：
for (int i : IntRange(1, 5)) {
    std::cout << i << " "; // 1 2 3 4
}
\`\`\`

也可以用自由函式的方式：

\`\`\`cpp
auto begin(MyContainer& c) { return c.first(); }
auto end(MyContainer& c) { return c.last(); }
\`\`\`

## C++20 init-statement（初始化語句）

C++20 允許在 range-based for 中加入初始化語句：

\`\`\`cpp
// C++20: for (init; decl : expr)
for (auto vec = getVector(); const auto& elem : vec) {
    std::cout << elem << " ";
}

// 實用：在迴圈中追蹤索引
for (int i = 0; const auto& elem : container) {
    std::cout << i++ << ": " << elem << "\\n";
}

// 搭配結構化綁定
for (auto m = getMap(); const auto& [key, val] : m) {
    std::cout << key << " = " << val << "\\n";
}
\`\`\`

## 效能注意事項

1. **避免不必要的拷貝**：
\`\`\`cpp
// 壞：每次迭代都拷貝 string
for (auto s : vecOfStrings) { ... }
// 好：使用 const 引用
for (const auto& s : vecOfStrings) { ... }
\`\`\`

2. **小心臨時物件的生命週期**：
\`\`\`cpp
// 安全：臨時物件生命週期延長到迴圈結束
for (auto& x : getVector()) { ... }

// 危險！鏈式呼叫可能產生懸空引用
// for (auto& x : getObj().getVec()) { ... }
// getObj() 的臨時物件在迴圈前可能已銷毀！
\`\`\`

3. **對 map 使用結構化綁定**（C++17）更清晰：
\`\`\`cpp
// C++11
for (const auto& p : myMap) {
    std::cout << p.first << ": " << p.second;
}
// C++17（更易讀）
for (const auto& [key, value] : myMap) {
    std::cout << key << ": " << value;
}
\`\`\`

## 適用範圍

- STL 容器（vector, list, map, set...）
- C 風格陣列
- std::initializer_list
- 任何提供 begin()/end() 的物件

## Best Practice

- 唯讀遍歷用 \\\`const auto&\\\`
- 需要修改元素用 \\\`auto&\\\`
- 避免用值拷貝（除非型別很小如 int）
- 不要在迴圈中增刪容器元素
- 小心鏈式呼叫產生的臨時物件懸空引用
- C++20 中利用 init-statement 限制變數作用域
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
      ],
      solution: `#include <iostream>
#include <vector>

int main() {
    int n;
    std::cin >> n;

    std::vector<int> nums(n);
    for (auto& x : nums) {
        std::cin >> x;
    }

    for (auto& x : nums) {
        if (x % 2 != 0) {
            x *= 2;
        }
    }

    int sum = 0;
    for (const auto& x : nums) {
        sum += x;
    }

    std::cout << sum << std::endl;

    return 0;
}`
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

- \\\`[]\\\` - 不捕獲任何變數
- \\\`[=]\\\` - 以值捕獲所有變數
- \\\`[&]\\\` - 以引用捕獲所有變數
- \\\`[x]\\\` - 以值捕獲 x
- \\\`[&x]\\\` - 以引用捕獲 x
- \\\`[=, &x]\\\` - 全部以值捕獲，x 以引用捕獲
- \\\`[this]\\\` - 捕獲 this 指標
- \\\`[*this]\\\` - C++17，以值捕獲整個物件（拷貝）

### 值捕獲 vs 引用捕獲的細節

**值捕獲**在 lambda 建立時拷貝值，之後外部變數的變化不影響 lambda：

\`\`\`cpp
int x = 10;
auto f = [x]() { return x; }; // 拷貝 x=10
x = 20;
f(); // 仍然回傳 10
\`\`\`

**引用捕獲**持有外部變數的引用，始終反映最新值：

\`\`\`cpp
int x = 10;
auto f = [&x]() { return x; }; // 引用 x
x = 20;
f(); // 回傳 20
\`\`\`

**生命週期陷阱**：引用捕獲最大的風險是懸空引用：

\`\`\`cpp
std::function<int()> makeLambda() {
    int local = 42;
    return [&local]() { return local; }; // 危險！
    // local 在函式結束後銷毀，lambda 持有懸空引用
}
\`\`\`

## mutable Lambda

以值捕獲的變數預設是 const，不能修改。加上 \\\`mutable\\\` 可以修改：

\`\`\`cpp
int count = 0;
auto counter = [count]() mutable {
    return ++count; // 修改的是 lambda 內部的拷貝
};
counter(); // 1
counter(); // 2
// 外部的 count 仍然是 0
\`\`\`

## 搭配 STL 演算法

Lambda 最常用於 STL 演算法中：

\`\`\`cpp
std::sort(vec.begin(), vec.end(),
    [](int a, int b) { return a > b; }); // 降序排列
\`\`\`

## C++14: 泛型 Lambda (Generic Lambda)

\`\`\`cpp
// C++14: auto 參數
auto print = [](const auto& x) { std::cout << x; };
print(42);       // int
print("hello");  // const char*
print(3.14);     // double
\`\`\`

## C++20: 模板 Lambda

C++20 允許 lambda 擁有顯式模板參數：

\`\`\`cpp
// C++20: 顯式模板參數
auto toVector = []<typename T>(const T& container) {
    return std::vector(container.begin(), container.end());
};

// 可以加 concept 約束
auto add = []<typename T>(T a, T b) requires std::integral<T> {
    return a + b;
};
\`\`\`

## C++14: init capture（初始化捕獲）

\`\`\`cpp
auto ptr = std::make_unique<int>(42);
auto lambda = [p = std::move(ptr)]() { return *p; };
// 可以用來移動不可拷貝的物件進 lambda
\`\`\`

## Lambda 作為回呼 (Callback) 與 std::function

Lambda 天生適合作為回呼函式：

\`\`\`cpp
// 直接用模板接受 lambda（零成本）
template<typename Callback>
void process(int data, Callback cb) {
    cb(data * 2);
}

// 用 std::function（有額外開銷）
void process(int data, std::function<void(int)> cb) {
    cb(data * 2);
}
\`\`\`

**std::function 的開銷**：
- 可能觸發堆積記憶體配置（小物件最佳化除外）
- 透過虛函式呼叫，無法內聯
- 大小固定（通常 32-64 bytes）
- 當 lambda 不需要型別擦除時，優先用模板或 \\\`auto\\\`

## 立即呼叫的 Lambda (IIFE)

Lambda 可以定義後立即呼叫，用於複雜的初始化：

\`\`\`cpp
// 用 IIFE 初始化 const 變數
const auto config = [&]() {
    Config c;
    c.width = loadWidth();
    c.height = loadHeight();
    c.fullscreen = checkFullscreen();
    return c;
}(); // 注意結尾的 ()！

// 替代多行條件初始化
const auto value = [&]() -> int {
    if (condition1) return computeA();
    if (condition2) return computeB();
    return defaultValue;
}();
\`\`\`

## 遞迴 Lambda

Lambda 無法直接遞迴呼叫自身（因為 \\\`auto\\\` 尚未完成推導）。解法：

\`\`\`cpp
// 方法一：使用 std::function（有開銷）
std::function<int(int)> factorial = [&](int n) -> int {
    return n <= 1 ? 1 : n * factorial(n - 1);
};

// 方法二：傳遞自身作為參數（零成本）
auto factorial = [](auto self, int n) -> int {
    return n <= 1 ? 1 : n * self(self, n - 1);
};
factorial(factorial, 5); // 120
\`\`\`

## Best Practice

- 短小的回呼函式用 lambda
- 需要重複使用的邏輯抽成具名函式
- 預設以 \\\`[&]\\\` 捕獲時要注意生命週期
- 避免不必要地使用 \\\`std::function\\\`，優先用模板或 \\\`auto\\\`
- 用 IIFE 進行複雜的 const 變數初始化
- Lambda 超過 3-5 行時考慮提取成具名函式
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
      ],
      solution: `#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> nums(n);
    for (auto& x : nums) std::cin >> x;

    std::sort(nums.begin(), nums.end(), [](int a, int b) {
        return std::abs(a) < std::abs(b);
    });

    auto positiveCount = std::count_if(nums.begin(), nums.end(), [](int x) {
        return x > 0;
    });

    for (int i = 0; i < n; i++) {
        if (i > 0) std::cout << " ";
        std::cout << nums[i];
    }
    std::cout << std::endl;
    std::cout << positiveCount << std::endl;

    return 0;
}`
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

## 所有權語意 (Ownership Semantics)

C++ 的資源管理核心概念是**所有權**：
- **獨佔所有權**：同一時間只有一個擁有者 → \\\`unique_ptr\\\`
- **共享所有權**：多個擁有者，最後一個銷毀時釋放 → \\\`shared_ptr\\\`
- **觀察者**：不擁有資源，只是觀察 → \\\`weak_ptr\\\` 或裸指標

選擇智慧指標的原則：先考慮 \\\`unique_ptr\\\`，只在真正需要共享時才用 \\\`shared_ptr\\\`。

## std::unique_ptr

**獨佔所有權**的智慧指標，不可複製但可移動：

\`\`\`cpp
auto ptr = std::make_unique<int>(42);
// auto ptr2 = ptr;           // 編譯錯誤！不可複製
auto ptr2 = std::move(ptr);   // 所有權轉移，ptr 變成 nullptr
\`\`\`

## std::shared_ptr

**共享所有權**的智慧指標，使用引用計數：

\`\`\`cpp
auto sp1 = std::make_shared<int>(42);
auto sp2 = sp1; // 引用計數 +1
\`\`\`

### 循環引用問題

\\\`shared_ptr\\\` 最大的陷阱是循環引用，會導致記憶體洩漏：

\`\`\`cpp
struct Node {
    std::shared_ptr<Node> next;
    // 如果兩個 Node 互相指向對方：
    // A->next = B, B->next = A
    // 引用計數永遠不會降到 0！
};
\`\`\`

## std::weak_ptr

不增加引用計數，解決循環引用問題：

\`\`\`cpp
struct Node {
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev;  // 用 weak_ptr 打破循環！
};

// 使用 weak_ptr
std::weak_ptr<int> wp = sp1;
if (auto locked = wp.lock()) {
    // locked 是 shared_ptr，物件仍然存活
    std::cout << *locked << std::endl;
} else {
    // 物件已被銷毀
}
\`\`\`

\\\`weak_ptr\\\` 的典型用途：
- **打破循環引用**（如雙向連結、樹的父子關係）
- **快取**（觀察物件是否仍存在）
- **觀察者模式**（不延長被觀察者的生命週期）

## 自定義刪除器 (Custom Deleter)

智慧指標可以使用自定義的清理邏輯：

\`\`\`cpp
// unique_ptr 自定義刪除器（影響型別）
auto fileDeleter = [](FILE* f) { fclose(f); };
std::unique_ptr<FILE, decltype(fileDeleter)>
    file(fopen("data.txt", "r"), fileDeleter);

// shared_ptr 自定義刪除器（不影響型別）
std::shared_ptr<FILE> file2(
    fopen("data.txt", "r"),
    [](FILE* f) { fclose(f); }
);

// 管理 C 風格 API 的資源
std::unique_ptr<SDL_Window, decltype(&SDL_DestroyWindow)>
    window(SDL_CreateWindow(...), SDL_DestroyWindow);
\`\`\`

## make_unique / make_shared 的優勢

為什麼要用 \\\`make_unique\\\` 和 \\\`make_shared\\\` 而非直接 \\\`new\\\`？

\`\`\`cpp
// 1. 異常安全
// 危險：如果 g() 拋出異常，new Widget 可能洩漏
f(std::shared_ptr<Widget>(new Widget), g());

// 安全：make_shared 是單一操作
f(std::make_shared<Widget>(), g());

// 2. make_shared 只配置一次記憶體
auto sp = std::make_shared<int>(42);
// 將控制區塊和物件放在同一塊記憶體中

// 3. 更簡潔，不需重複型別名稱
auto ptr = std::make_unique<MyLongClassName>(args);
\`\`\`

## 別名建構子 (Aliasing Constructor)

\\\`shared_ptr\\\` 的別名建構子讓你共享所有權但指向不同的物件：

\`\`\`cpp
struct Composite {
    int data;
    std::string name;
};

auto composite = std::make_shared<Composite>();
// 指向 composite->data，但共享 composite 的所有權
std::shared_ptr<int> dataPtr(composite, &composite->data);
// composite 至少在 dataPtr 存活期間不會被銷毀
\`\`\`

## enable_shared_from_this

當物件需要取得指向自身的 \\\`shared_ptr\\\` 時使用：

\`\`\`cpp
class Widget : public std::enable_shared_from_this<Widget> {
public:
    std::shared_ptr<Widget> getPtr() {
        return shared_from_this(); // 安全取得 shared_ptr
        // 不能用 shared_ptr<Widget>(this)，會產生兩個控制區塊！
    }
};

// 注意：物件必須已經被 shared_ptr 管理
auto w = std::make_shared<Widget>();
auto w2 = w->getPtr(); // OK
\`\`\`

## Best Practice

- 優先使用 \\\`make_unique\\\` 和 \\\`make_shared\\\`
- 預設使用 \\\`unique_ptr\\\`，需要共享時才用 \\\`shared_ptr\\\`
- 函式參數傳遞：用 raw pointer 或 reference（不轉移所有權時）
- 永遠不要用 \\\`new\\\`/\\\`delete\\\`
- 用 \\\`weak_ptr\\\` 打破循環引用
- 需要從 \\\`this\\\` 取得 \\\`shared_ptr\\\` 時繼承 \\\`enable_shared_from_this\\\`
- 自定義刪除器讓智慧指標可以管理任何資源
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
      ],
      solution: `#include <iostream>
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
    std::vector<std::shared_ptr<Widget>> widgets;
    for (int i = 1; i <= 3; i++) {
        widgets.push_back(std::make_shared<Widget>(i));
    }

    for (const auto& w : widgets) {
        std::cout << "Widget " << w->id() << " count: " << w.use_count() << std::endl;
    }

    widgets.clear();

    std::cout << "Done" << std::endl;
    return 0;
}`
    }
  },
  {
    id: 'move-semantics',
    category: 'cpp11-syntax',
    title: '移動語意與右值參考',
    description: '理解 C++11 最重要的效能優化特性：移動語意、右值參考、std::move。',
    difficulty: 'advanced',
    content: `# 移動語意與右值參考

## 左值 vs 右值 — 詳細解析

每個 C++ 表達式都有**值類別 (value category)**：

- **左值 (lvalue)**：有名稱、可取址的表達式
  - 變數名稱、字串字面量 \\\`"hello"\\\`、回傳引用的函式呼叫
- **純右值 (prvalue)**：臨時值、數值字面量
  - \\\`42\\\`、\\\`std::string("temp")\\\`、回傳非引用型別的函式呼叫
- **將亡值 (xvalue)**：即將被移動的物件
  - \\\`std::move(x)\\\` 的結果

\`\`\`cpp
int x = 42;
int& ref = x;           // OK: 左值引用綁定左值
int&& rref = 42;        // OK: 右值引用綁定純右值
int&& rref2 = std::move(x); // OK: 將亡值
\`\`\`

**重要**：右值引用變數本身是左值（有名稱）。

## 右值參考 (&&)

\`\`\`cpp
int&& rref = 42;          // 右值參考
std::string&& s = "temp"; // 綁定到臨時值
\`\`\`

## 移動建構與移動賦值 — 詳解

移動操作「偷取」資源而非拷貝：

\`\`\`cpp
class MyString {
    char* data_;
    size_t size_;
public:
    MyString(MyString&& other) noexcept
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;
        other.size_ = 0;
    }

    MyString& operator=(MyString&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            data_ = other.data_;
            size_ = other.size_;
            other.data_ = nullptr;
            other.size_ = 0;
        }
        return *this;
    }
};
\`\`\`

## std::move 不會真正移動！

\\\`std::move\\\` 只做型別轉換，真正的移動發生在移動建構/賦值中：

\`\`\`cpp
// std::move 的本質是 static_cast
template<typename T>
decltype(auto) move(T&& t) noexcept {
    return static_cast<std::remove_reference_t<T>&&>(t);
}

std::string s1 = "hello";
std::string s2 = std::move(s1); // 真正移動在 string 移動建構
\`\`\`

## Rule of Five（五法則）

如果你定義了以下任一個，通常需要全部定義：
1. 解構函式
2. 拷貝建構
3. 拷貝賦值
4. 移動建構
5. 移動賦值

**Rule of Zero 更好**：用 \\\`vector\\\`、\\\`unique_ptr\\\` 等管理資源，不自定義特殊成員函式。

## noexcept 的重要性

移動操作**一定要標記 noexcept**，否則 STL 容器退化為拷貝：

\`\`\`cpp
// vector 重新分配時的邏輯：
// if (移動建構是 noexcept) → 移動（快）
// else → 拷貝（慢，但安全）
\`\`\`

## 完美轉發 (Perfect Forwarding) 簡介

用**萬能引用**和 \\\`std::forward\\\` 保持參數的值類別：

\`\`\`cpp
template<typename T>
void wrapper(T&& arg) {  // 萬能引用，非右值引用
    target(std::forward<T>(arg));
}
wrapper(42);   // 右值 → 移動
int x = 42;
wrapper(x);    // 左值 → 拷貝
\`\`\`

## RVO / NRVO — 編譯器自動優化

編譯器可省略拷貝/移動，直接在呼叫端建構物件：

\`\`\`cpp
std::vector<int> createVector() {
    std::vector<int> v = {1, 2, 3};
    return v;  // NRVO: 零拷貝零移動
}
\`\`\`

**不要對回傳值使用 std::move！** 會阻止 RVO：

\`\`\`cpp
return std::move(v); // 壞！阻止 NRVO
return v;            // 好！讓編譯器優化
\`\`\`

## Best Practice

- 移動操作標記為 \\\`noexcept\\\`
- 移動後的物件應處於有效但未指定的狀態
- 不要對 const 物件使用 std::move（無效果）
- 不要對回傳的局部變數使用 std::move
- 優先遵循 Rule of Zero
- std::move 只是 cast，不會真正移動
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
      ],
      solution: `#include <iostream>
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

    DynamicArray(DynamicArray&& other) noexcept
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;
        other.size_ = 0;
    }

    DynamicArray& operator=(DynamicArray&& other) noexcept {
        if (this != &other) {
            delete[] data_;
            data_ = other.data_;
            size_ = other.size_;
            other.data_ = nullptr;
            other.size_ = 0;
        }
        return *this;
    }

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
}`
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
template<typename... Args>  // Args: template parameter pack
void print(Args... args) {  // args: function parameter pack
}
\`\`\`

\\\`typename... Args\\\` 宣告模板參數包，可匹配零個或多個型別。

## sizeof... 運算子

取得參數包中的參數數量（編譯期常數）：

\`\`\`cpp
template<typename... Args>
constexpr size_t count(Args...) {
    return sizeof...(Args);
}
count(1, "hello", 3.14); // 3
\`\`\`

## 遞迴展開（C++11 風格）

\`\`\`cpp
void print() {} // base case
template<typename T, typename... Rest>
void print(T first, Rest... rest) {
    std::cout << first << " ";
    print(rest...); // 遞迴展開剩餘參數
}
\`\`\`

## Parameter Pack 展開模式

參數包可以套用模式後展開：

\`\`\`cpp
template<typename... Args>
void example(Args... args) {
    f(args...);       // f(a1, a2, a3)
    f(g(args)...);    // f(g(a1), g(a2), g(a3))
    f(&args...);      // f(&a1, &a2, &a3)
}
\`\`\`

## Fold Expressions（C++17 折疊表達式）

C++17 大幅簡化參數包的展開：

\`\`\`cpp
// 一元右折疊: (args op ...)
template<typename... Args>
auto sum(Args... args) {
    return (args + ...); // a1 + (a2 + (a3 + ...))
}

// 二元折疊（帶初始值）
template<typename... Args>
auto sum_safe(Args... args) {
    return (args + ... + 0); // 空參數包回傳 0
}

// 逗號折疊 — 對每個參數執行操作
template<typename... Args>
void printAll(Args... args) {
    ((std::cout << args << " "), ...);
}

// 邏輯折疊
template<typename... Args>
bool allPositive(Args... args) {
    return ((args > 0) && ...);
}
\`\`\`

## 可變參數類別模板

\`\`\`cpp
// 簡化版 tuple 概念
template<typename... Types>
struct Tuple {};

template<typename Head, typename... Tail>
struct Tuple<Head, Tail...> {
    Head value;
    Tuple<Tail...> rest;
};

template<>
struct Tuple<> {};
\`\`\`

## 真實世界應用

\`\`\`cpp
// 1. make_unique 實作原理
template<typename T, typename... Args>
std::unique_ptr<T> my_make_unique(Args&&... args) {
    return std::unique_ptr<T>(
        new T(std::forward<Args>(args)...)
    );
}

// 2. 一次加入多個元素
template<typename Container, typename... Items>
void addAll(Container& c, Items&&... items) {
    (c.push_back(std::forward<Items>(items)), ...);
}
\`\`\`

## 應用場景

- 型別安全的 printf
- std::make_unique / std::make_shared 的實作
- tuple、variant 的實作
- 完美轉發多個參數
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
      ],
      solution: `#include <iostream>

template<typename T>
T max_of(T value) {
    return value;
}

template<typename T, typename... Args>
T max_of(T first, Args... rest) {
    T rest_max = max_of(rest...);
    return first > rest_max ? first : rest_max;
}

int main() {
    std::cout << max_of(3, 7, 2, 9, 4) << std::endl;
    std::cout << max_of(1.5, 3.7, 2.1) << std::endl;
    std::cout << max_of(42) << std::endl;
    return 0;
}`
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

### 1. 陣列
\`\`\`cpp
int arr[] = {1, 2, 3};
auto [a, b, c] = arr;  // 綁定數量必須與陣列大小一致
\`\`\`

### 2. pair / tuple
\`\`\`cpp
auto [key, value] = std::make_pair("name", 42);
auto [x, y, z] = std::make_tuple(1, 2.0, "three");
\`\`\`

### 3. struct（所有成員必須是 public）
\`\`\`cpp
struct Point { int x, y; };
auto [x, y] = Point{3, 4};
// 綁定順序與成員宣告順序一致
\`\`\`

### 4. map 遍歷
\`\`\`cpp
for (const auto& [key, val] : myMap) { ... }
\`\`\`

## const 與引用綁定

\`\`\`cpp
std::pair<int, std::string> p{42, "hello"};

auto [a, b] = p;          // 值綁定（拷貝）
const auto& [ca, cb] = p; // const 引用（唯讀，無拷貝）
auto& [ra, rb] = p;       // 引用（可修改原始物件）
ra = 100;                  // p.first 變成 100
\`\`\`

## 讓自定義類別支援結構化綁定

非 public 成員的類別需提供 tuple 協定：

\`\`\`cpp
class MyPoint {
    double x_, y_;
public:
    MyPoint(double x, double y) : x_(x), y_(y) {}
    double x() const { return x_; }
    double y() const { return y_; }
};

// 提供 tuple_size, tuple_element, get
template<> struct std::tuple_size<MyPoint>
    : std::integral_constant<size_t, 2> {};
template<size_t I>
struct std::tuple_element<I, MyPoint> { using type = double; };
template<size_t I>
double get(const MyPoint& p) {
    if constexpr (I == 0) return p.x();
    else return p.y();
}

auto [x, y] = MyPoint(3.0, 4.0); // OK
\`\`\`

## 搭配 if / switch 初始化語句

C++17 的 if init-statement 與結構化綁定非常搭：

\`\`\`cpp
// map::insert 回傳 pair<iterator, bool>
if (auto [it, ok] = myMap.insert({key, val}); ok) {
    std::cout << "插入成功" << std::endl;
}

// map::find
if (auto it = scores.find("Alice"); it != scores.end()) {
    auto& [name, score] = *it;
    score += 5; // 直接修改
}
\`\`\`

## Best Practice

- 搭配 \\\`const auto&\\\` 避免不必要的拷貝
- 變數名稱要有意義
- 搭配 if init-statement 限制變數作用域
- 綁定數量必須與成員/元素數量完全匹配
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
      ],
      solution: `#include <iostream>
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

    auto [maxName, maxScore] = students[0];
    auto [minName, minScore] = students[0];

    for (const auto& [name, score] : students) {
        if (score > maxScore) {
            maxName = name;
            maxScore = score;
        }
        if (score < minScore) {
            minName = name;
            minScore = score;
        }
    }

    std::cout << "Max: " << maxName << " " << maxScore << std::endl;
    std::cout << "Min: " << minName << " " << minScore << std::endl;

    return 0;
}`
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

### optional 的操作方法

\`\`\`cpp
std::optional<int> opt = 42;

if (opt) { /* 有值 */ }           // 布林檢查
int val = *opt;                   // 無檢查取值（無值時 UB）
int val2 = opt.value();           // 無值時拋出例外
int val3 = opt.value_or(0);      // 無值時回傳預設值
opt.emplace(100);                 // 就地建構
opt.reset();                      // 清除為 nullopt
\`\`\`

### optional 的 Monadic 操作（C++23）

\`\`\`cpp
std::optional<int> opt = 42;
// transform: 有值時轉換
auto doubled = opt.transform([](int x) { return x * 2; });

// and_then: 有值時回傳另一個 optional
auto result = opt.and_then([](int x) -> std::optional<int> {
    return x > 0 ? std::optional(x * 2) : std::nullopt;
});

// or_else: 無值時的替代操作
auto fallback = opt.or_else([]() { return std::optional(0); });
\`\`\`

## std::variant<Types...>

型別安全的 union，可以持有指定型別之一：

\`\`\`cpp
std::variant<int, double, std::string> v;
v = 42;
v = "hello"s;
std::get<std::string>(v); // "hello"
\`\`\`

### variant vs 繼承多型

- **variant**：編譯期固定型別集合、棧上配置、無虛函式開銷
- **繼承多型**：可擴展型別、需要指標/堆積、有 vtable 開銷
- variant 適合已知固定型別集合，繼承適合開放式擴展

### std::visit 與多重 variant

\`\`\`cpp
// overloaded 輔助工具
template<class... Ts> struct overloaded : Ts... {
    using Ts::operator()...;
};
template<class... Ts> overloaded(Ts...) -> overloaded<Ts...>;

std::variant<int, double, std::string> v = "hello"s;
std::visit(overloaded{
    [](int i) { std::cout << "int: " << i; },
    [](double d) { std::cout << "double: " << d; },
    [](const auto& s) { std::cout << "other: " << s; }
}, v);

// 同時 visit 多個 variant
std::variant<int, std::string> v1 = 42;
std::variant<double, bool> v2 = true;
std::visit([](auto a, auto b) {
    std::cout << a << ", " << b;
}, v1, v2);
\`\`\`

## std::any

可持有任意型別的值（類似 void*，但型別安全）：

\`\`\`cpp
std::any a = 42;
a = std::string("hello");
auto s = std::any_cast<std::string>(a);
// 錯誤型別會拋出 std::bad_any_cast
\`\`\`

\\\`any\\\` 內部使用型別擦除，可能需要堆積配置，效能不如 \\\`variant\\\`。

## 何時使用哪一個？

- **函式可能無回傳值** → \\\`optional\\\`
- **已知固定型別集合** → \\\`variant\\\`
- **完全未知型別** → \\\`any\\\`（盡量避免）
- **錯誤處理** → \\\`optional\\\` 或 \\\`variant<Value, Error>\\\`

## Best Practice

- 優先使用 \\\`optional\\\`（明確語意）
- \\\`variant\\\` 搭配 \\\`std::visit\\\` 使用，避免 \\\`std::get\\\` 拋出例外
- \\\`any\\\` 盡量少用，優先考慮 \\\`variant\\\`
- 用 \\\`value_or()\\\` 提供預設值
- 使用 overloaded lambda 模式簡化 visit
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
      ],
      solution: `#include <iostream>
#include <optional>
#include <string>

std::optional<int> safe_stoi(const std::string& s) {
    try {
        return std::stoi(s);
    } catch (...) {
        return std::nullopt;
    }
}

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
}`
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

## requires 表達式詳解

\`\`\`cpp
template<typename T>
concept Container = requires(T c) {
    c.begin();                                    // 簡單需求
    c.end();
    { c.size() } -> std::convertible_to<size_t>;  // 回傳型別約束
    typename T::value_type;                        // 型別需求
    requires sizeof(T) > 0;                        // 巢狀需求
};

// 複合需求
template<typename T>
concept Addable = requires(T a, T b) {
    { a + b } -> std::same_as<T>;
};
\`\`\`

## 使用 Concept 的四種語法

\`\`\`cpp
// 方式一：requires clause（尾端）
template<typename T> requires Numeric<T>
T add(T a, T b) { return a + b; }

// 方式二：requires clause（前端）
template<typename T>
T multiply(T a, T b) requires Numeric<T> { return a * b; }

// 方式三：簡潔語法
template<Numeric T>
T divide(T a, T b) { return a / b; }

// 方式四：abbreviated function template
Numeric auto square(Numeric auto x) { return x * x; }
\`\`\`

## 約束 auto 參數

\`\`\`cpp
void print(const std::integral auto& value) {
    std::cout << value << std::endl;
}
print(42);     // OK
// print(3.14); // 編譯錯誤！
\`\`\`

## Concept-based 多載

更特定的 concept 優先匹配：

\`\`\`cpp
template<typename T> void process(T) { /* general */ }
template<std::integral T> void process(T) { /* integral */ }
template<std::floating_point T> void process(T) { /* float */ }

process(42);    // integral
process(3.14);  // float
process("hi");  // general
\`\`\`

## Subsumption（包含關係）

\`\`\`cpp
template<typename T>
concept Movable = std::is_move_constructible_v<T>;
template<typename T>
concept Copyable = Movable<T> && std::is_copy_constructible_v<T>;

// Copyable 包含 Movable，更特定的優先
template<Movable T> void f(T) { /* 1 */ }
template<Copyable T> void f(T) { /* 2 - Copyable 型別選此 */ }
\`\`\`

## 標準庫常用 Concepts

\`\`\`cpp
#include <concepts>
std::integral<T>           // 整數型別
std::floating_point<T>     // 浮點型別
std::same_as<T, U>         // 型別相同
std::convertible_to<T, U>  // 可轉換
std::derived_from<T, U>    // 繼承關係
std::equality_comparable<T> // 支援 ==
std::totally_ordered<T>     // 支援比較
std::movable<T>            // 可移動
std::copyable<T>           // 可拷貝
std::invocable<F, Args...> // 可呼叫
std::predicate<F, Args...> // 回傳 bool 的可呼叫
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
      ],
      solution: `#include <iostream>
#include <concepts>
#include <vector>
#include <string>
#include <algorithm>

template<typename T>
concept Sortable = requires(T a, T b) {
    { a < b } -> std::convertible_to<bool>;
};

template<Sortable T>
void my_sort(std::vector<T>& v) {
    std::sort(v.begin(), v.end());
}

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
}`
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

## Views vs Actions

- **Views**：惰性求值，不建立新容器，遍歷時才計算
- **Actions**：立即求值，如 \\\`ranges::sort\\\`

\`\`\`cpp
// View: 惰性，不配置記憶體
auto v = vec | std::views::filter([](int n){ return n > 0; });
// 此時沒有計算！遍歷時才執行

// Action: 立即排序
std::ranges::sort(vec);
\`\`\`

## 惰性求值 (Lazy Evaluation)

可以處理無限序列：

\`\`\`cpp
auto squares = std::views::iota(1)     // 無限序列 1, 2, 3, ...
    | std::views::transform([](int n){ return n * n; })
    | std::views::take(5);
// 只計算前 5 個: 1, 4, 9, 16, 25
\`\`\`

## Views（視圖）

Views 不會建立新容器，而是在遍歷時動態計算：

\`\`\`cpp
auto even = vec | std::views::filter([](int n){ return n % 2 == 0; });
auto squared = vec | std::views::transform([](int n){ return n * n; });
\`\`\`

## Range Adaptors（管線組合）

\`\`\`cpp
auto result = vec
    | std::views::filter([](int n){ return n > 0; })
    | std::views::transform([](int n){ return n * n; })
    | std::views::take(5);
\`\`\`

## 投影 (Projections)

Ranges 演算法支援投影，簡化比較邏輯：

\`\`\`cpp
struct Person { std::string name; int age; };
std::vector<Person> people = {{"Alice", 30}, {"Bob", 25}};

// 按 age 排序
std::ranges::sort(people, {}, &Person::age);
// 按 name 查找
auto it = std::ranges::find(people, "Bob", &Person::name);
\`\`\`

## ranges::to（C++23）

將 view 轉換為容器：

\`\`\`cpp
// C++23
auto vec = std::views::iota(1, 10)
    | std::views::filter([](int n){ return n % 2 == 0; })
    | std::ranges::to<std::vector>();

// C++20 替代方案
auto view = /* ... */;
std::vector<int> vec2(view.begin(), view.end());
\`\`\`

## 常用 Views

- \\\`filter\\\` - 過濾
- \\\`transform\\\` - 轉換
- \\\`take\\\` / \\\`drop\\\` - 取前/去前 N 個
- \\\`take_while\\\` / \\\`drop_while\\\` - 條件取/去
- \\\`reverse\\\` - 反轉
- \\\`keys\\\` / \\\`values\\\` - map 的鍵/值
- \\\`iota\\\` - 產生序列
- \\\`split\\\` / \\\`join\\\` - 分割/合併
- \\\`zip\\\` (C++23) - 配對多個範圍
- \\\`enumerate\\\` (C++23) - 帶索引遍歷

## Ranges 版演算法的改進

\`\`\`cpp
std::ranges::sort(vec);           // 接受容器
std::ranges::find(vec, 42);       // 不需 begin/end
std::ranges::max(people, {}, &Person::age); // 投影
\`\`\`

## Best Practice

- 用管線組合取代巢狀迴圈
- 利用惰性求值避免中間容器
- 善用投影簡化比較邏輯
- C++23 的 \\\`ranges::to\\\` 讓 view 到容器轉換更方便
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
      ],
      solution: `#include <iostream>
#include <vector>
#include <ranges>

int main() {
    int n;
    std::cin >> n;
    std::vector<int> nums(n);
    for (auto& x : nums) std::cin >> x;

    bool first = true;
    for (auto val : nums
            | std::views::filter([](int n){ return n % 2 == 0; })
            | std::views::transform([](int n){ return n * n; })
            | std::views::take(3)) {
        if (!first) std::cout << " ";
        std::cout << val;
        first = false;
    }
    std::cout << std::endl;

    return 0;
}`
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

## RAII 是 C++ 的核心慣用法

RAII 是 C++ 資源管理的**核心哲學**：
- **取得資源**（記憶體、檔案、鎖、連線）在**建構函式**中進行
- **釋放資源**在**解構函式**中自動進行
- 物件離開作用域時，解構函式**保證**被呼叫（即使有例外）

## 為什麼 RAII 重要？

\`\`\`cpp
// 不使用 RAII（危險！）
void unsafe() {
    int* p = new int[100];
    // 如果拋出異常，記憶體洩漏！
    process(p);
    delete[] p;
}

// 使用 RAII（安全）
void safe() {
    auto p = std::make_unique<int[]>(100);
    process(p.get());
} // 無論正常或例外，都自動釋放
\`\`\`

## Scope Guard（作用域守衛）

通用的 RAII 工具，離開作用域時執行清理：

\`\`\`cpp
class ScopeGuard {
    std::function<void()> cleanup_;
    bool active_ = true;
public:
    ScopeGuard(std::function<void()> f) : cleanup_(std::move(f)) {}
    ~ScopeGuard() { if (active_) cleanup_(); }
    void dismiss() { active_ = false; }
};

void transaction() {
    beginTransaction();
    ScopeGuard rollback([&]() { rollbackTransaction(); });
    step1(); step2(); step3();
    commitTransaction();
    rollback.dismiss(); // 成功，不需回滾
}
\`\`\`

## 各種資源的 RAII 管理

\`\`\`cpp
// 檔案：std::fstream 是天然 RAII
void processFile(const std::string& path) {
    std::ifstream file(path);
    // 離開時自動關閉
}

// C API 用 unique_ptr 包裝
auto file = std::unique_ptr<FILE, decltype(&fclose)>(
    fopen("data.txt", "r"), fclose);

// 互斥鎖
std::mutex mtx;
void safe_update() {
    std::lock_guard lock(mtx);    // 上鎖
    shared_data.update();
}  // 自動解鎖，即使 update() 拋出例外

// 資料庫連線
class DBConnection {
    Connection* conn_;
public:
    DBConnection(const std::string& url)
        : conn_(db_connect(url.c_str())) {}
    ~DBConnection() { db_disconnect(conn_); }
    DBConnection(const DBConnection&) = delete;
};
\`\`\`

## 異常安全保證

RAII 是實現異常安全的基礎：

- **nothrow**：操作保證不拋出例外
- **strong**：全有或全無，失敗時狀態不變
- **basic**：不會洩漏資源，物件仍有效
- **no guarantee**：應避免

RAII 自動提供至少 basic guarantee。

## RAII vs finally / defer

其他語言用 \\\`finally\\\`（Java）或 \\\`defer\\\`（Go）。C++ 的 RAII 更優越：

- **自動化**：不需記得寫 finally
- **可組合**：多個 RAII 物件按逆序銷毀
- **零成本**：不需額外執行期機制

\`\`\`cpp
void example() {
    std::lock_guard lock(mtx);          // 1
    auto conn = DBConnection(url);      // 2
    std::ofstream log("log.txt");       // 3
    // 離開時按 3, 2, 1 順序自動清理
}
\`\`\`

## RAII 應用

- 智慧指標管理記憶體
- std::lock_guard / unique_lock 管理互斥鎖
- std::fstream 管理檔案
- ScopeGuard 管理臨時性清理

## Best Practice

- 所有資源都應該被 RAII 物件管理
- 永遠不要手動管理資源（new/delete, fopen/fclose）
- 讓解構函式做清理工作
- 解構函式不應拋出例外
- 不可複製的資源禁用拷貝，允許移動
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
      ],
      solution: `#include <iostream>
#include <functional>

class ScopeGuard {
    std::function<void()> func_;
    bool active_ = true;
public:
    ScopeGuard(std::function<void()> func) : func_(std::move(func)) {}
    ~ScopeGuard() {
        if (active_ && func_) func_();
    }
    void dismiss() { active_ = false; }
    ScopeGuard(const ScopeGuard&) = delete;
    ScopeGuard& operator=(const ScopeGuard&) = delete;
};

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
}`
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
    int data_;
public:
    int getValue() const { return data_; }  // 承諾不修改物件
    void setValue(int v) { data_ = v; }
};
const MyClass obj;
obj.getValue();     // OK
// obj.setValue(10); // 編譯錯誤！
\`\`\`

const 成員函式中 \\\`this\\\` 是 \\\`const MyClass*\\\`，不能修改非 mutable 成員。

## mutable 關鍵字

允許在 const 函式中修改特定成員（用於快取、鎖等）：

\`\`\`cpp
class Cached {
    mutable int cache_ = -1;
    mutable bool cached_ = false;
public:
    int compute() const {
        if (!cached_) {
            cache_ = /* 昂貴計算 */;
            cached_ = true;
        }
        return cache_;
    }
};
\`\`\`

## const_cast

移除 const 限定符（危險，應避免）：

\`\`\`cpp
const int x = 42;
int& ref = const_cast<int&>(x);
ref = 100;  // 未定義行為！

// 唯一合理場景：不正確的遺留 API
void legacy_api(char* str);  // 實際不修改 str
legacy_api(const_cast<char*>("hello"));
\`\`\`

## East const vs West const

\`\`\`cpp
// West const（傳統）
const int* p;
// East const（一致性更好）
int const* p;
// 都正確，專案內保持一致即可
\`\`\`

## constexpr vs const

\`\`\`cpp
const int x = 42;       // 執行期常數
constexpr int y = 42;   // 編譯期常數

constexpr int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
}
constexpr int f5 = factorial(5); // 編譯期計算

// C++20 consteval: 強制編譯期
consteval int sqr(int n) { return n * n; }
\`\`\`

## const 在多執行緒中的角色

C++11 規定 const 成員函式應該是執行緒安全的：

\`\`\`cpp
class ThreadSafe {
    mutable std::mutex mtx_;
    int data_ = 0;
public:
    int getData() const {
        std::lock_guard lock(mtx_);
        return data_;
    }
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
- 用 \\\`mutable\\\` 處理快取和互斥鎖
- 避免 \\\`const_cast\\\`
- 用 \\\`constexpr\\\` 取代 const 做編譯期常數
- const 成員函式應是執行緒安全的
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
      ],
      solution: `#include <iostream>
#include <string>
#include <vector>

class Student {
    std::string name_;
    std::vector<int> grades_;
public:
    Student(std::string name) : name_(std::move(name)) {}

    const std::string& getName() const { return name_; }

    void addGrade(int grade) { grades_.push_back(grade); }

    double getAverage() const {
        double sum = 0;
        for (const auto& g : grades_) sum += g;
        return grades_.empty() ? 0 : sum / grades_.size();
    }
};

void printStudent(const Student& s) {
    std::cout << s.getName() << ": " << s.getAverage() << std::endl;
}

int main() {
    Student s("Alice");
    s.addGrade(90);
    s.addGrade(85);
    s.addGrade(92);
    printStudent(s);
    return 0;
}`
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

## 為什麼 Singleton 具有爭議性？

Singleton 經常被認為是一種 **anti-pattern**，原因包括：

- **隱藏的依賴關係**：使用 Singleton 的類別不會在介面中顯示其依賴，讓程式碼難以理解
- **全域可變狀態**：Singleton 本質上是全域變數的包裝，增加程式碼耦合度
- **違反單一職責原則**：Singleton 同時管理自身的生命週期和業務邏輯
- **難以平行測試**：多個測試共享同一個 Singleton 實例，測試之間會互相影響

## 執行緒安全性深入探討

### Meyer's Singleton（推薦）

C++11 標準 §6.7 保證：如果多個執行緒同時進入 static local variable 的宣告，只有一個執行緒會執行初始化，其餘會等待：

\`\`\`cpp
// 這是 C++11 起最安全、最簡潔的寫法
Singleton& Singleton::instance() {
    static Singleton inst;  // 編譯器保證執行緒安全
    return inst;
}
\`\`\`

### Double-Checked Locking Anti-Pattern

在 C++11 之前，開發者常使用 double-checked locking，但這在沒有記憶體屏障的情況下是 **未定義行為**：

\`\`\`cpp
// ❌ 經典的錯誤寫法（C++11 之前）
class BadSingleton {
    static BadSingleton* ptr;
    static std::mutex mtx;
public:
    static BadSingleton* instance() {
        if (!ptr) {                    // 第一次檢查（無鎖）
            std::lock_guard<std::mutex> lock(mtx);
            if (!ptr) {                // 第二次檢查（有鎖）
                ptr = new BadSingleton;  // 可能重排序！
            }
        }
        return ptr;
    }
};

// ✅ 如果必須用指標，使用 call_once
class SafeSingleton {
    static std::unique_ptr<SafeSingleton> ptr;
    static std::once_flag flag;
public:
    static SafeSingleton& instance() {
        std::call_once(flag, []() {
            ptr = std::make_unique<SafeSingleton>();
        });
        return *ptr;
    }
};
\`\`\`

## 替代方案：依賴注入 (Dependency Injection)

與其使用 Singleton，更好的做法通常是**依賴注入**：

\`\`\`cpp
// ❌ 使用 Singleton — 耦合度高
class Service {
    void doWork() {
        Logger::instance().log("working");  // 隱藏依賴
    }
};

// ✅ 使用依賴注入 — 易於測試和替換
class Service {
    ILogger& logger_;
public:
    explicit Service(ILogger& logger) : logger_(logger) {}
    void doWork() {
        logger_.log("working");  // 明確依賴
    }
};
\`\`\`

## 可測試性問題

Singleton 導致單元測試困難，因為無法輕易替換實例：

\`\`\`cpp
// 可測試的 Singleton 設計（折衷方案）
class TestableLogger {
public:
    static TestableLogger& instance() {
        static TestableLogger inst;
        return inst;
    }
    // 允許測試時重置狀態
    void reset() { messages_.clear(); }
    // 或者使用可替換的介面
    void setBackend(std::unique_ptr<ILogBackend> backend) {
        backend_ = std::move(backend);
    }
private:
    std::vector<std::string> messages_;
    std::unique_ptr<ILogBackend> backend_;
};
\`\`\`

## 適當使用 Singleton 的場景

Singleton 在以下情況下是合理的：

1. **硬體資源的抽象**：例如裝置驅動程式、螢幕管理器
2. **真正的全域唯一資源**：如主事件迴圈、主視窗
3. **效能關鍵的快取**：需要全域共享且初始化代價高昂
4. **日誌系統**：幾乎每個元件都需要，注入反而增加複雜度

### 最佳實踐總結

| 做法 | 建議 |
|------|------|
| 使用 Meyer's Singleton | ✅ 推薦 |
| 使用 double-checked locking | ❌ 避免 |
| Singleton 搭配介面抽象 | ✅ 提升可測試性 |
| 過度使用 Singleton | ❌ 考慮依賴注入 |
| 在 Singleton 中持有可變狀態 | ⚠️ 需要額外的同步機制 |
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
      ],
      solution: `#include <iostream>
#include <string>

class Logger {
    int count_ = 0;
    Logger() = default;
public:
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

    static Logger& instance() {
        static Logger inst;
        return inst;
    }

    void log(const std::string& message) {
        std::cout << "[LOG] " << message << std::endl;
        ++count_;
    }

    int count() const { return count_; }
};

int main() {
    Logger::instance().log("App started");
    Logger::instance().log("Processing data");
    Logger::instance().log("App finished");
    std::cout << "Total: " << Logger::instance().count() << std::endl;
    return 0;
}`
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

## 事件驅動架構 (Event-Driven Architecture)

觀察者模式是事件驅動架構的核心。在此架構中，程式的控制流由**事件**決定，而非順序執行：

\`\`\`cpp
// 事件驅動架構的基礎元件
struct Event {
    std::string type;
    std::any data;
    std::chrono::time_point<std::chrono::steady_clock> timestamp;
};

class EventBus {
    std::unordered_map<std::string,
        std::vector<std::function<void(const Event&)>>> handlers_;
public:
    void subscribe(const std::string& type, auto&& handler) {
        handlers_[type].emplace_back(std::forward<decltype(handler)>(handler));
    }
    void publish(Event event) {
        event.timestamp = std::chrono::steady_clock::now();
        if (auto it = handlers_.find(event.type); it != handlers_.end()) {
            for (auto& handler : it->second) handler(event);
        }
    }
};
\`\`\`

## Signal/Slot 模式

Signal/Slot 是觀察者模式的一種優雅實現，源自 Qt 框架，但可以用純 C++ 實現：

\`\`\`cpp
template<typename... Args>
class Signal {
    using SlotType = std::function<void(Args...)>;
    std::vector<std::pair<int, SlotType>> slots_;
    int next_id_ = 0;
public:
    // 連接 slot，返回 ID 用於斷開
    int connect(SlotType slot) {
        int id = next_id_++;
        slots_.emplace_back(id, std::move(slot));
        return id;
    }
    void disconnect(int id) {
        std::erase_if(slots_, [id](const auto& p) { return p.first == id; });
    }
    void emit(Args... args) const {
        for (const auto& [id, slot] : slots_) slot(args...);
    }
};
\`\`\`

## 使用 weak_ptr 防止懸空觀察者

當觀察者的生命週期可能比被觀察者短時，使用 \`weak_ptr\` 來防止懸空指標：

\`\`\`cpp
template<typename... Args>
class SafeSignal {
    struct Connection {
        int id;
        std::weak_ptr<void> guard;  // 生命週期守衛
        std::function<void(Args...)> callback;
    };
    std::vector<Connection> connections_;
    int next_id_ = 0;
public:
    // 綁定時傳入觀察者的 shared_ptr 作為生命週期守衛
    template<typename T>
    int connect(std::shared_ptr<T> observer, std::function<void(Args...)> cb) {
        int id = next_id_++;
        connections_.push_back({id, observer, std::move(cb)});
        return id;
    }

    void emit(Args... args) {
        // 自動清除已失效的觀察者
        std::erase_if(connections_, [](const auto& c) {
            return c.guard.expired();
        });
        for (auto& conn : connections_) {
            if (!conn.guard.expired()) {
                conn.callback(args...);
            }
        }
    }
};
\`\`\`

## 使用 std::function 的現代 C++ 觀察者

\`std::function\` 讓觀察者模式不再需要繼承介面，可以使用 lambda、函式指標、成員函式等：

\`\`\`cpp
class Button {
public:
    Signal<> onClick;                    // 無參數信號
    Signal<int, int> onMouseMove;        // 帶座標信號

    void click() { onClick.emit(); }
    void moveMouse(int x, int y) { onMouseMove.emit(x, y); }
};

// 使用時非常靈活
Button btn;
btn.onClick.connect([]() { std::cout << "Lambda handler\\n"; });
btn.onClick.connect(&freeFunction);
btn.onClick.connect(std::bind(&MyClass::method, &obj));
\`\`\`

## 與響應式程式設計 (Reactive Programming) 的比較

| 特性 | 觀察者模式 | 響應式程式設計 (RxCpp) |
|------|-----------|----------------------|
| 資料流 | 簡單推送 | 可組合的資料流 |
| 運算子 | 無 | map, filter, merge 等 |
| 錯誤處理 | 手動 | 內建 onError |
| 背壓處理 | 無 | 支援背壓控制 |
| 取消訂閱 | 手動管理 | Disposable 自動管理 |
| 複雜度 | 低 | 高 |

### 選擇建議

- **簡單的事件通知** → 觀察者模式 + \`std::function\`
- **複雜的事件流轉換** → 響應式程式設計
- **GUI 事件處理** → Signal/Slot 模式
- **跨模組通訊** → 事件匯流排 (EventBus)
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
      ],
      solution: `#include <iostream>
#include <string>
#include <vector>
#include <functional>

class Stock {
    std::string name_;
    double price_;
    std::vector<std::function<void(const std::string&, double, double)>> observers_;
public:
    Stock(const std::string& name, double price) : name_(name), price_(price) {}

    void addObserver(std::function<void(const std::string&, double, double)> observer) {
        observers_.push_back(std::move(observer));
    }

    void setPrice(double newPrice) {
        double oldPrice = price_;
        price_ = newPrice;
        for (const auto& observer : observers_) {
            observer(name_, oldPrice, newPrice);
        }
    }
};

int main() {
    Stock apple("AAPL", 150.0);

    apple.addObserver([](const std::string& name, double oldP, double newP) {
        std::cout << name << ": $" << oldP << " -> $" << newP << std::endl;
    });

    apple.setPrice(155.0);
    apple.setPrice(148.0);

    return 0;
}`
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

## 三種工廠模式的區別

### 1. 簡單工廠 (Simple Factory)

最基本的形式，使用一個函式根據參數決定建立哪種物件：

\`\`\`cpp
// 簡單工廠 — 使用 if/switch 判斷
std::unique_ptr<Shape> createShape(const std::string& type) {
    if (type == "circle") return std::make_unique<Circle>(1.0);
    if (type == "rect")   return std::make_unique<Rectangle>(1.0, 1.0);
    throw std::invalid_argument("Unknown shape: " + type);
}
\`\`\`

**缺點**：每次新增產品都需要修改工廠函式，違反開放封閉原則。

### 2. 工廠方法 (Factory Method)

透過繼承讓子類別決定建立哪種物件：

\`\`\`cpp
class Document {
public:
    virtual ~Document() = default;
    virtual std::unique_ptr<Page> createPage() = 0;  // 工廠方法
};

class PDFDocument : public Document {
public:
    std::unique_ptr<Page> createPage() override {
        return std::make_unique<PDFPage>();
    }
};
\`\`\`

### 3. 抽象工廠 (Abstract Factory)

建立一系列相關物件的介面：

\`\`\`cpp
class UIFactory {
public:
    virtual ~UIFactory() = default;
    virtual std::unique_ptr<Button> createButton() = 0;
    virtual std::unique_ptr<TextBox> createTextBox() = 0;
};

class WindowsUIFactory : public UIFactory {
    std::unique_ptr<Button> createButton() override {
        return std::make_unique<WindowsButton>();
    }
    std::unique_ptr<TextBox> createTextBox() override {
        return std::make_unique<WindowsTextBox>();
    }
};
\`\`\`

## 註冊式工廠 (Registration-Based Factory)

Modern C++ 中最常用的模式，產品類別自行註冊到工廠：

\`\`\`cpp
template<typename Base>
class Factory {
    using Creator = std::function<std::unique_ptr<Base>()>;
    std::unordered_map<std::string, Creator> registry_;
public:
    void registerType(const std::string& name, Creator creator) {
        registry_[name] = std::move(creator);
    }
    std::unique_ptr<Base> create(const std::string& name) const {
        auto it = registry_.find(name);
        if (it == registry_.end())
            throw std::runtime_error("Unknown type: " + name);
        return it->second();
    }
    std::vector<std::string> registeredTypes() const {
        std::vector<std::string> types;
        for (const auto& [name, _] : registry_) types.push_back(name);
        return types;
    }
};
\`\`\`

## 使用 CRTP 實現自動註冊工廠

透過 CRTP，讓子類別在程式啟動時**自動**註冊到工廠：

\`\`\`cpp
template<typename Base, typename Derived>
class AutoRegister {
    struct Registrar {
        Registrar() {
            Factory<Base>::instance().registerType(
                Derived::typeName(),
                []() { return std::make_unique<Derived>(); }
            );
        }
    };
    static inline Registrar registrar_{};  // C++17 inline static
};

// 繼承 AutoRegister 即自動註冊，無需手動呼叫
class Circle : public Shape, public AutoRegister<Shape, Circle> {
public:
    static std::string typeName() { return "circle"; }
    double area() const override { return 3.14159 * r_ * r_; }
private:
    double r_ = 1.0;
};
\`\`\`

## 帶參數的現代工廠實現

\`\`\`cpp
template<typename Base, typename... Args>
class ParametricFactory {
    using Creator = std::function<std::unique_ptr<Base>(Args...)>;
    std::unordered_map<std::string, Creator> creators_;
public:
    template<typename Derived>
    void registerType(const std::string& name) {
        creators_[name] = [](Args... args) {
            return std::make_unique<Derived>(std::forward<Args>(args)...);
        };
    }
    std::unique_ptr<Base> create(const std::string& name, Args... args) {
        return creators_.at(name)(std::forward<Args>(args)...);
    }
};

// 使用
ParametricFactory<Shape, double> factory;
factory.registerType<Circle>("circle");
auto shape = factory.create("circle", 5.0);
\`\`\`

### 工廠模式選擇指南

| 場景 | 推薦方式 |
|------|---------|
| 少量固定類型 | 簡單工廠 |
| 框架中的擴展點 | 工廠方法 |
| 跨平台 UI 元件 | 抽象工廠 |
| 外掛系統 / 開放式擴展 | 註冊式工廠 |
| 需要零配置的自動註冊 | CRTP 自動註冊工廠 |
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
      ],
      solution: `#include <iostream>
#include <memory>
#include <string>

class Beverage {
public:
    virtual ~Beverage() = default;
    virtual std::string name() const = 0;
    virtual double price() const = 0;
};

class Coffee : public Beverage {
public:
    std::string name() const override { return "Coffee"; }
    double price() const override { return 4.5; }
};

class Tea : public Beverage {
public:
    std::string name() const override { return "Tea"; }
    double price() const override { return 3; }
};

class Juice : public Beverage {
public:
    std::string name() const override { return "Juice"; }
    double price() const override { return 5; }
};

class BeverageFactory {
public:
    std::unique_ptr<Beverage> create(const std::string& type) const {
        if (type == "coffee") return std::make_unique<Coffee>();
        if (type == "tea") return std::make_unique<Tea>();
        if (type == "juice") return std::make_unique<Juice>();
        return nullptr;
    }
};

int main() {
    BeverageFactory factory;

    auto coffee = factory.create("coffee");
    auto tea = factory.create("tea");
    auto juice = factory.create("juice");

    if (coffee) std::cout << coffee->name() << ": $" << coffee->price() << std::endl;
    if (tea) std::cout << tea->name() << ": $" << tea->price() << std::endl;
    if (juice) std::cout << juice->name() << ": $" << juice->price() << std::endl;

    return 0;
}`
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

## 執行緒生命週期

執行緒建立後必須選擇 join 或 detach：

\`\`\`cpp
std::thread t(task);
t.join();    // 阻塞等待執行緒完成
// 或
t.detach();  // 分離執行緒，獨立執行
// ❌ 既不 join 也不 detach，析構時呼叫 std::terminate()
\`\`\`

### joinable vs detached

| 特性 | join | detach |
|------|------|--------|
| 主執行緒行為 | 阻塞等待 | 不等待 |
| 適用場景 | 需要結果 | 背景任務 |
| 安全性 | ✅ 較安全 | ⚠️ 注意生命週期 |

## C++20: std::jthread

自動 join 並支援協作取消：

\`\`\`cpp
{
    std::jthread t([](std::stop_token stoken) {
        while (!stoken.stop_requested()) {
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
        std::cout << "收到停止請求\\n";
    });
} // 離開 scope 時自動請求停止並 join
\`\`\`

## Mutex 類型總覽

### std::recursive_mutex
允許同一執行緒多次鎖定（適用於遞迴呼叫）：
\`\`\`cpp
std::recursive_mutex rmtx;
void funcA() { std::lock_guard lock(rmtx); funcB(); }
void funcB() { std::lock_guard lock(rmtx); } // 同一執行緒，不死鎖
\`\`\`

### std::timed_mutex
支援帶超時的鎖定嘗試：
\`\`\`cpp
std::timed_mutex tmtx;
if (tmtx.try_lock_for(std::chrono::milliseconds(100))) {
    tmtx.unlock();
}
\`\`\`

### std::shared_mutex (C++17)
讀寫鎖 — 多讀者共享，寫者獨佔：
\`\`\`cpp
std::shared_mutex rw_mutex;
void reader() { std::shared_lock lock(rw_mutex); }
void writer() { std::unique_lock lock(rw_mutex); }
\`\`\`

## Lock 類型比較

| Lock 類型 | 特點 | 使用場景 |
|-----------|------|---------|
| lock_guard | 純 RAII | 基本互斥 |
| unique_lock | 可延遲鎖定、轉移所有權 | 條件變數 |
| shared_lock | 共享鎖 | 讀寫鎖讀端 |
| scoped_lock | 同時鎖多個 mutex | 避免死鎖 |

## 死鎖避免策略

1. **鎖定順序**：所有執行緒以相同順序取得鎖
2. **std::scoped_lock**：使用無死鎖演算法同時鎖定多個 mutex
\`\`\`cpp
std::scoped_lock lock(mtx1, mtx2);  // 推薦
\`\`\`

## thread_local 儲存

每個執行緒擁有獨立副本，不需同步：
\`\`\`cpp
thread_local int counter = 0;
\`\`\`

## hardware_concurrency

\`\`\`cpp
unsigned int n = std::thread::hardware_concurrency();
unsigned int pool_size = n > 0 ? n : 4;
\`\`\`
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
      ],
      solution: `#include <iostream>
#include <thread>
#include <mutex>
#include <vector>

class BankAccount {
    double balance_;
    std::mutex mutex_;
public:
    BankAccount(double initial) : balance_(initial) {}

    void deposit(double amount) {
        std::lock_guard<std::mutex> lock(mutex_);
        balance_ += amount;
    }

    void withdraw(double amount) {
        std::lock_guard<std::mutex> lock(mutex_);
        if (amount <= balance_) {
            balance_ -= amount;
        }
    }

    double balance() const { return balance_; }
};

int main() {
    BankAccount account(1000.0);

    std::vector<std::thread> threads;

    for (int i = 0; i < 5; i++) {
        threads.emplace_back([&account]() {
            account.deposit(100.0);
        });
    }

    for (int i = 0; i < 3; i++) {
        threads.emplace_back([&account]() {
            account.withdraw(100.0);
        });
    }

    for (auto& t : threads) t.join();

    std::cout << "Balance: " << account.balance() << std::endl;
    return 0;
}`
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

## shared_future：多個消費者

\`std::future\` 只能 get() 一次，\`std::shared_future\` 允許多個消費者：

\`\`\`cpp
std::promise<int> p;
std::shared_future<int> sf = p.get_future().share();

// 多個執行緒可以同時等待同一個結果
auto t1 = std::async([sf]() { return sf.get() * 2; });
auto t2 = std::async([sf]() { return sf.get() + 10; });

p.set_value(42);
std::cout << t1.get() << ", " << t2.get(); // 84, 52
\`\`\`

## packaged_task：延遲執行

將 callable 包裝成可延遲執行的任務，並提供 future：

\`\`\`cpp
std::packaged_task<int(int, int)> task([](int a, int b) {
    return a + b;
});

auto future = task.get_future();
// 任務還沒執行...
task(3, 4);         // 現在執行
int result = future.get(); // 7

// 常用於執行緒池：將 task 放入佇列，由工作執行緒執行
\`\`\`

## 例外傳播

例外會透過 future 自動傳播到呼叫者：

\`\`\`cpp
auto f = std::async([]() -> int {
    throw std::runtime_error("計算失敗");
    return 42;
});

try {
    f.get();  // 重新拋出例外
} catch (const std::exception& e) {
    std::cout << "捕獲: " << e.what(); // "計算失敗"
}

// promise 也支援例外傳播
std::promise<int> p;
p.set_exception(std::make_exception_ptr(
    std::runtime_error("錯誤")
));
\`\`\`

## future 狀態檢查 (wait_for)

非阻塞式檢查任務是否完成：

\`\`\`cpp
auto f = std::async(std::launch::async, long_task);

// 非阻塞輪詢
while (true) {
    auto status = f.wait_for(std::chrono::milliseconds(100));
    if (status == std::future_status::ready) {
        std::cout << "結果: " << f.get() << "\\n";
        break;
    } else if (status == std::future_status::timeout) {
        std::cout << "仍在計算...\\n";
    } else if (status == std::future_status::deferred) {
        std::cout << "延遲執行，呼叫 get() 才會開始\\n";
        break;
    }
}
\`\`\`

## when_all / when_any 模式

C++ 標準目前沒有 when_all/when_any，但可以自行實現：

\`\`\`cpp
// when_all：等待所有 future 完成
template<typename... Futures>
auto when_all(Futures&&... futures) {
    return std::make_tuple(futures.get()...);
}

// when_any：返回最先完成的結果（簡化版）
template<typename T>
T when_any(std::vector<std::future<T>>& futures) {
    while (true) {
        for (auto& f : futures) {
            if (f.wait_for(std::chrono::milliseconds(1))
                == std::future_status::ready) {
                return f.get();
            }
        }
    }
}
\`\`\`

## thread + promise vs async 比較

| 特性 | std::async | thread + promise |
|------|-----------|-----------------|
| 簡潔度 | ✅ 非常簡潔 | ❌ 較冗長 |
| 控制力 | ❌ 較少 | ✅ 完全控制 |
| 例外處理 | 自動傳播 | 需手動 set_exception |
| 執行策略 | launch::async/deferred | 一定建立執行緒 |
| 執行緒重用 | 可能重用（實作決定） | 不重用 |

\`\`\`cpp
// std::async（簡潔）
auto f = std::async(compute, args);
auto result = f.get();

// thread + promise（控制力強）
std::promise<int> p;
auto f = p.get_future();
std::thread t([&p]() {
    try { p.set_value(compute()); }
    catch (...) { p.set_exception(std::current_exception()); }
});
auto result = f.get();
t.join();
\`\`\`
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
      ],
      solution: `#include <iostream>
#include <future>
#include <vector>
#include <numeric>

long long square_sum(const std::vector<long long>& nums, int start, int end) {
    long long sum = 0;
    for (int i = start; i < end; ++i) {
        sum += nums[i] * nums[i];
    }
    return sum;
}

int main() {
    int n;
    std::cin >> n;
    std::vector<long long> nums(n);
    for (auto& x : nums) std::cin >> x;

    int mid = n / 2;
    auto future1 = std::async(std::launch::async, square_sum, std::cref(nums), 0, mid);
    auto future2 = std::async(std::launch::async, square_sum, std::cref(nums), mid, n);

    long long result = future1.get() + future2.get();
    std::cout << result << std::endl;

    return 0;
}`
    }
  },
  {
    id: 'condition-variables',
    category: 'system-programming',
    title: '條件變數與生產者-消費者',
    description: '使用 std::condition_variable 實現執行緒間的同步與通訊。',
    difficulty: 'advanced',
    content: `# 條件變數 (Condition Variables)

## 什麼是條件變數？為什麼需要它？

在多執行緒程式設計中，我們經常遇到「一個執行緒需要等待某個條件成立才能繼續執行」的場景。最直覺的做法是**忙等待 (busy-waiting)**：

\`\`\`cpp
// ❌ 忙等待：浪費 CPU 資源
while (!ready) {
    // 不斷檢查，佔用 CPU 時間
}
\`\`\`

這種方式極度浪費 CPU 資源。條件變數 (Condition Variable) 提供了一種高效的替代方案：讓等待的執行緒**進入睡眠狀態**，直到被其他執行緒**喚醒**。

\`\`\`cpp
// ✅ 使用條件變數：高效等待
std::unique_lock<std::mutex> lock(mtx);
cv.wait(lock, [&]{ return ready; });  // 睡眠直到 ready 為 true
\`\`\`

## 條件變數的內部機制：wait/notify 協議

條件變數的運作基於 **wait/notify** 協議：

1. **等待方 (waiter)**：
   - 取得 mutex 鎖
   - 檢查條件是否滿足
   - 若不滿足，呼叫 \`cv.wait()\`：**原子地釋放鎖並進入睡眠**
   - 被喚醒後，**自動重新取得鎖**
   - 再次檢查條件（防止虛假喚醒）

2. **通知方 (notifier)**：
   - 取得 mutex 鎖
   - 修改共享狀態（使條件成立）
   - 釋放鎖
   - 呼叫 \`notify_one()\` 或 \`notify_all()\` 喚醒等待的執行緒

\`\`\`cpp
std::mutex mtx;
std::condition_variable cv;
bool data_ready = false;

// 等待方
void consumer() {
    std::unique_lock<std::mutex> lock(mtx);
    cv.wait(lock, [&]{ return data_ready; });
    // 此時 lock 已重新取得，可安全存取共享資料
    process_data();
}

// 通知方
void producer() {
    {
        std::lock_guard<std::mutex> lock(mtx);
        prepare_data();
        data_ready = true;
    }  // 鎖在此釋放
    cv.notify_one();  // 喚醒一個等待的執行緒
}
\`\`\`

## std::condition_variable vs std::condition_variable_any

C++ 標準庫提供兩種條件變數：

| 特性 | condition_variable | condition_variable_any |
|------|-------------------|----------------------|
| 鎖類型 | 只能搭配 \`std::unique_lock<std::mutex>\` | 可搭配任何符合 BasicLockable 的鎖 |
| 效能 | 較高（針對 mutex 最佳化） | 較低（需要額外的內部鎖） |
| 使用場景 | 大多數情況 | 需要自訂鎖或 shared_mutex 時 |

\`\`\`cpp
// condition_variable_any 可搭配 shared_lock
std::shared_mutex smtx;
std::condition_variable_any cv_any;

// 可以用 shared_lock 等待
std::shared_lock<std::shared_mutex> slock(smtx);
cv_any.wait(slock, [&]{ return ready; });
\`\`\`

**建議**：除非有特殊需求，優先使用 \`std::condition_variable\`，效能更好。

## 為什麼必須用 unique_lock？不能用 lock_guard？

\`cv.wait()\` 在內部需要執行兩個關鍵操作：
1. **釋放鎖**（讓其他執行緒能修改共享狀態）
2. **重新取得鎖**（被喚醒後保護共享資料的存取）

\`lock_guard\` 只支援 RAII 式的建構時上鎖、解構時解鎖，**沒有中途解鎖/重新上鎖的能力**。而 \`unique_lock\` 提供了 \`lock()\`、\`unlock()\` 方法，讓條件變數能在 wait 時操控鎖的狀態。

\`\`\`cpp
// unique_lock 的靈活性
std::unique_lock<std::mutex> lock(mtx);
// lock 已上鎖
cv.wait(lock, pred);
// wait 內部流程：
//   1. 若 pred() 為 false：
//      a. lock.unlock()   ← 需要 unique_lock 的 unlock()
//      b. 進入睡眠等待通知
//      c. 被喚醒後 lock.lock()  ← 需要 unique_lock 的 lock()
//      d. 回到步驟 1 重新檢查 pred()
//   2. 若 pred() 為 true：返回，此時鎖仍被持有
\`\`\`

## 虛假喚醒 (Spurious Wakeups)

### 什麼是虛假喚醒？

虛假喚醒是指執行緒在**沒有收到 notify 的情況下被喚醒**。這是作業系統和硬體層面的行為，POSIX 標準明確允許這種情況發生。原因包括：

- 作業系統的執行緒調度機制
- 多處理器系統的信號處理
- 系統中斷

### 如何防範？

**永遠使用帶有 predicate 的 wait 版本**：

\`\`\`cpp
// ❌ 不安全：可能因虛假喚醒而錯誤地繼續執行
cv.wait(lock);
// 醒來了，但條件可能還沒成立！

// ✅ 安全：predicate 版本自動處理虛假喚醒
cv.wait(lock, [&]{ return ready; });
// 等同於：
// while (!ready) { cv.wait(lock); }
\`\`\`

predicate 版本在每次喚醒時都會重新檢查條件，只有條件為 true 時才真正返回。

## wait 的三種變體

### 1. wait — 無限等待

\`\`\`cpp
// 等到條件滿足為止
std::unique_lock<std::mutex> lock(mtx);
cv.wait(lock, [&]{ return ready; });
\`\`\`

### 2. wait_for — 限時等待（相對時間）

\`\`\`cpp
std::unique_lock<std::mutex> lock(mtx);
// 最多等待 5 秒
auto status = cv.wait_for(lock, std::chrono::seconds(5),
                          [&]{ return ready; });
if (status) {
    // 條件在時限內滿足
} else {
    // 超時，條件仍未滿足
}
\`\`\`

### 3. wait_until — 限時等待（絕對時間）

\`\`\`cpp
std::unique_lock<std::mutex> lock(mtx);
auto deadline = std::chrono::steady_clock::now()
                + std::chrono::seconds(10);
auto status = cv.wait_until(lock, deadline,
                            [&]{ return ready; });
if (status) {
    // 條件在期限前滿足
} else {
    // 已超過期限
}
\`\`\`

## notify_one vs notify_all

| 方法 | 行為 | 使用時機 |
|------|------|---------|
| \`notify_one()\` | 喚醒**一個**等待中的執行緒 | 只有一個執行緒能處理，或任一執行緒都可以處理 |
| \`notify_all()\` | 喚醒**所有**等待中的執行緒 | 多個執行緒可能都需要回應，或條件改變影響所有等待者 |

\`\`\`cpp
// 場景 1：生產者-消費者（notify_one 即可）
// 每次只有一個消費者能取走一個任務
queue.push(task);
cv.notify_one();

// 場景 2：狀態改變（使用 notify_all）
// 所有等待者都需要知道遊戲結束了
game_over = true;
cv.notify_all();

// 場景 3：關閉佇列（使用 notify_all）
// 所有消費者都需要被喚醒以檢查關閉狀態
done = true;
cv.notify_all();
\`\`\`

## 經典模式

### 1. 生產者-消費者 (Producer-Consumer)

\`\`\`cpp
template<typename T>
class ThreadSafeQueue {
    std::queue<T> queue_;
    std::mutex mtx_;
    std::condition_variable cv_;
    bool closed_ = false;
public:
    void push(T val) {
        { std::lock_guard lk(mtx_); queue_.push(std::move(val)); }
        cv_.notify_one();
    }
    bool pop(T& val) {
        std::unique_lock lk(mtx_);
        cv_.wait(lk, [&]{ return !queue_.empty() || closed_; });
        if (queue_.empty()) return false;
        val = std::move(queue_.front()); queue_.pop();
        return true;
    }
    void close() {
        { std::lock_guard lk(mtx_); closed_ = true; }
        cv_.notify_all();
    }
};
\`\`\`

### 2. 有界緩衝區 (Bounded Buffer)

\`\`\`cpp
template<typename T>
class BoundedBuffer {
    std::queue<T> buf_;
    size_t cap_;
    std::mutex mtx_;
    std::condition_variable not_full_, not_empty_;
public:
    BoundedBuffer(size_t cap) : cap_(cap) {}
    void put(T val) {
        std::unique_lock lk(mtx_);
        not_full_.wait(lk, [&]{ return buf_.size() < cap_; });
        buf_.push(std::move(val));
        not_empty_.notify_one();
    }
    T take() {
        std::unique_lock lk(mtx_);
        not_empty_.wait(lk, [&]{ return !buf_.empty(); });
        T val = std::move(buf_.front()); buf_.pop();
        not_full_.notify_one();
        return val;
    }
};
\`\`\`

### 3. 事件通知 (One-shot Event)

\`\`\`cpp
class Event {
    std::mutex mtx_;
    std::condition_variable cv_;
    bool signaled_ = false;
public:
    void signal() {
        { std::lock_guard lk(mtx_); signaled_ = true; }
        cv_.notify_all();
    }
    void wait() {
        std::unique_lock lk(mtx_);
        cv_.wait(lk, [&]{ return signaled_; });
    }
};
\`\`\`

### 4. 屏障 (Barrier)

\`\`\`cpp
class SimpleBarrier {
    std::mutex mtx_;
    std::condition_variable cv_;
    int count_;
    int waiting_ = 0;
public:
    SimpleBarrier(int n) : count_(n) {}
    void arrive_and_wait() {
        std::unique_lock lk(mtx_);
        ++waiting_;
        if (waiting_ >= count_) {
            waiting_ = 0;
            cv_.notify_all();
        } else {
            cv_.wait(lk, [&]{ return waiting_ == 0; });
        }
    }
};
\`\`\`

## 常見陷阱

### 1. 丟失通知 (Lost Notification)

\`\`\`cpp
// ❌ 錯誤：如果 notify 在 wait 之前發生，通知就丟失了
// 執行緒 A                    // 執行緒 B
                              ready = true;
                              cv.notify_one();
cv.wait(lock);                // 永遠不會被喚醒！

// ✅ 正確：先檢查條件，再決定是否等待
cv.wait(lock, [&]{ return ready; });
// 如果 ready 已為 true，直接返回
\`\`\`

### 2. 忘記持有鎖就修改共享狀態

\`\`\`cpp
// ❌ 資料競爭！
ready = true;          // 沒有鎖保護
cv.notify_one();

// ✅ 正確
{
    std::lock_guard lk(mtx);
    ready = true;      // 在鎖保護下修改
}
cv.notify_one();
\`\`\`

### 3. notify 的時機

\`\`\`cpp
// 可以在鎖內或鎖外 notify，但鎖外通常更好
// 鎖內 notify 可能導致被喚醒的執行緒立刻阻塞在 mutex 上
{
    std::lock_guard lk(mtx);
    ready = true;
    cv.notify_one();  // 可行但不最佳
}

// 更好：鎖外 notify
{
    std::lock_guard lk(mtx);
    ready = true;
}
cv.notify_one();  // 被喚醒的執行緒可直接取得鎖
\`\`\`

## 效能考量

1. **優先使用 notify_one()**：當只需要喚醒一個執行緒時，避免不必要的「驚群效應 (thundering herd)」
2. **減少鎖的持有時間**：在鎖外呼叫 notify，減少不必要的鎖競爭
3. **避免頻繁的 notify**：批量處理後再通知，減少上下文切換
4. **考慮使用 std::atomic + wait/notify**：C++20 提供了原子變數的 wait() 和 notify_one/all()，對於簡單的標誌位等待更輕量
5. **條件變數 vs 忙等待**：條件變數有系統呼叫的開銷，對於極短的等待（奈秒級），自旋鎖可能更高效

## 實際應用場景

- **執行緒池 (Thread Pool)**：工作執行緒等待新任務到來
- **任務佇列 (Task Queue)**：非同步任務排程與處理
- **資源池 (Connection Pool)**：等待可用的資料庫連線
- **日誌系統**：背景執行緒等待日誌資料寫入
- **事件驅動架構**：等待特定事件觸發後執行相應操作
- **流水線處理**：各階段等待前一階段的輸出
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
      ],
      solution: `#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <queue>
#include <vector>
#include <atomic>

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
    MessageQueue<int> mq;
    std::atomic<int> total{0};
    std::atomic<int> producers_done{0};

    std::vector<std::thread> threads;

    // 2 producers
    for (int p = 0; p < 2; ++p) {
        threads.emplace_back([&mq, &producers_done, p]() {
            for (int i = 1; i <= 5; ++i) {
                mq.push(p * 5 + i);
            }
            if (++producers_done == 2) {
                mq.close();
            }
        });
    }

    // 2 consumers
    for (int c = 0; c < 2; ++c) {
        threads.emplace_back([&mq, &total]() {
            int value;
            while (mq.pop(value)) {
                total.fetch_add(value);
            }
        });
    }

    for (auto& t : threads) t.join();

    std::cout << total.load() << std::endl;
    return 0;
}`
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

## 策略模式 vs 模板方法模式

| 特性 | 策略模式 | 模板方法模式 |
|------|---------|-------------|
| 變化機制 | 組合 (has-a) | 繼承 (is-a) |
| 切換時機 | 執行期動態切換 | 編譯期固定 |
| 彈性 | ✅ 高 | ❌ 較低 |
| 演算法結構 | 完全由策略決定 | 骨架固定，步驟可覆寫 |

\`\`\`cpp
// 模板方法：骨架固定，子類覆寫步驟
class DataProcessor {
public:
    void process() {
        readData();
        transform();   // 子類覆寫
        writeData();
    }
protected:
    virtual void transform() = 0;
};

// 策略模式：整個演算法可替換
class DataProcessor2 {
    std::function<Data(const Data&)> transform_;
public:
    void setTransform(auto&& fn) { transform_ = std::forward<decltype(fn)>(fn); }
};
\`\`\`

## 編譯期策略：Policy-Based Design

使用模板參數在編譯期選擇策略，零執行期開銷：

\`\`\`cpp
template<typename SortPolicy, typename PrintPolicy>
class DataHandler : private SortPolicy, private PrintPolicy {
    std::vector<int> data_;
public:
    void process() {
        this->sort(data_);    // SortPolicy::sort
        this->print(data_);   // PrintPolicy::print
    }
};

struct QuickSortPolicy {
    void sort(std::vector<int>& v) { std::sort(v.begin(), v.end()); }
};

DataHandler<QuickSortPolicy, ConsolePrintPolicy> handler;
\`\`\`

這是 Alexandrescu 提倡的 **Policy-Based Design**。

## std::function 效能考量

\`std::function\` 有一定的額外開銷：
- **小型物件最佳化 (SBO)**：小 callable 不需堆分配
- **大型 lambda**：可能觸發堆分配
- **呼叫開銷**：每次經過間接跳轉

\`\`\`cpp
// 效能敏感的替代方案
// 1. 模板參數（零成本）
template<typename Strategy>
void process(Strategy&& s) { s(); }

// 2. std::variant + std::visit（封閉集合，零成本）
using Strategy = std::variant<StrategyA, StrategyB>;
\`\`\`

### 選擇指南

| 需求 | 推薦方式 |
|------|---------|
| 編譯期固定策略 | 模板參數 (Policy) |
| 執行期切換、簡單介面 | std::function + lambda |
| 執行期切換、複雜介面 | 虛擬函式 + unique_ptr |
| 封閉集合、效能敏感 | std::variant + std::visit |
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
      ],
      solution: `#include <iostream>
#include <functional>
#include <string>

class Compressor {
    std::function<std::string(const std::string&)> strategy_;
public:
    void setStrategy(std::function<std::string(const std::string&)> strategy) {
        strategy_ = std::move(strategy);
    }
    std::string compress(const std::string& data) const {
        return strategy_(data);
    }
};

int main() {
    Compressor c;
    std::string data = "HelloWorld";

    c.setStrategy([](const std::string& s) { return s; });
    std::cout << c.compress(data) << std::endl;

    c.setStrategy([](const std::string& s) { return "RLE(" + s + ")"; });
    std::cout << c.compress(data) << std::endl;

    c.setStrategy([](const std::string& s) { return "ZIP(" + s + ")"; });
    std::cout << c.compress(data) << std::endl;

    return 0;
}`
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

## 雙重分派 (Double Dispatch) 深入解析

C++ 的虛擬函式只支援**單一分派**（根據物件的動態型別選擇方法）。Visitor 需要根據**兩個**物件的型別選擇行為，這就是雙重分派：

\`\`\`cpp
// 第一次分派：shape->accept(visitor) — 根據 shape 的型別
// 第二次分派：visitor.visit(*this) — 根據 visitor 的型別

class ShapeVisitor;
class Shape {
public:
    virtual void accept(ShapeVisitor& v) = 0;
};

class ShapeVisitor {
public:
    virtual void visit(Circle& c) = 0;
    virtual void visit(Rectangle& r) = 0;
};

class Circle : public Shape {
public:
    void accept(ShapeVisitor& v) override { v.visit(*this); }
};
\`\`\`

## 表達式問題 (Expression Problem)

這是程式語言理論中的經典難題：

- **物件導向**：容易新增型別，難以新增操作
- **函數式/Visitor**：容易新增操作，難以新增型別

\`\`\`
              新增型別    新增操作
OOP（虛擬函式）   ✅ 容易    ❌ 難
Visitor          ❌ 難      ✅ 容易
variant+visit    ⚠️ 需改    ✅ 容易（但編譯器會提醒遺漏）
\`\`\`

\`std::variant\` 的優勢是：新增型別時，編譯器會在所有 \`std::visit\` 的地方報錯，提醒你處理新型別。

## std::variant + std::visit 作為現代 Visitor

\`\`\`cpp
using Shape = std::variant<Circle, Rectangle, Triangle>;

// Visitor 1: 計算面積
double area(const Shape& s) {
    return std::visit([](const auto& shape) { return shape.area(); }, s);
}

// Visitor 2: 序列化（使用 overloaded pattern）
std::string serialize(const Shape& s) {
    return std::visit(overloaded{
        [](const Circle& c)    { return "circle:" + std::to_string(c.r); },
        [](const Rectangle& r) { return "rect:" + std::to_string(r.w); },
        [](const Triangle& t)  { return "tri:" + std::to_string(t.base); }
    }, s);
}
\`\`\`

## Overloaded Lambda Pattern 詳解

\`\`\`cpp
// C++17 版本
template<class... Ts> struct overloaded : Ts... { using Ts::operator()...; };
template<class... Ts> overloaded(Ts...) -> overloaded<Ts...>;

// C++20 版本（不需要推導指南）
template<class... Ts> struct overloaded : Ts... { using Ts::operator()...; };

// 使用方式
auto visitor = overloaded{
    [](int i)    { std::cout << "int: " << i; },
    [](double d) { std::cout << "double: " << d; },
    [](auto& x)  { std::cout << "other"; }  // 預設處理
};
\`\`\`

## 與虛擬函式的比較

| 特性 | 虛擬函式 | variant + visit |
|------|---------|----------------|
| 型別集合 | 開放（可繼承擴展） | 封閉（variant 中列舉） |
| 記憶體配置 | 堆分配 + 指標 | 棧上（variant 大小固定） |
| 效能 | vtable 間接跳轉 | 編譯期分派 |
| 適用場景 | 開放型別集合 | 封閉型別集合 |
| 快取友善度 | ❌ 指標追蹤 | ✅ 資料連續 |
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
      ],
      solution: `#include <iostream>
#include <variant>
#include <string>
#include <vector>

template<class... Ts> struct overloaded : Ts... { using Ts::operator()...; };
template<class... Ts> overloaded(Ts...) -> overloaded<Ts...>;

struct InfoEvent { std::string msg; };
struct WarningEvent { std::string msg; int code; };
struct ErrorEvent { std::string msg; int code; std::string stackTrace; };

using LogEvent = std::variant<InfoEvent, WarningEvent, ErrorEvent>;

std::string format(const LogEvent& event) {
    return std::visit(overloaded{
        [](const InfoEvent& e) {
            return "[INFO] " + e.msg;
        },
        [](const WarningEvent& e) {
            return "[WARN-" + std::to_string(e.code) + "] " + e.msg;
        },
        [](const ErrorEvent& e) {
            return "[ERROR-" + std::to_string(e.code) + "] " + e.msg + " | " + e.stackTrace;
        }
    }, event);
}

int main() {
    std::vector<LogEvent> events = {
        InfoEvent{"Server started"},
        WarningEvent{"Deprecated API call", 301},
        ErrorEvent{"Null pointer", 500, "main.cpp:42"}
    };

    for (const auto& event : events) {
        std::cout << format(event) << std::endl;
    }

    return 0;
}`
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

## 靜態多態深入解析

CRTP 在編譯期解析所有呼叫，編譯器可以完全內聯：

\`\`\`cpp
template<typename Derived>
class Shape {
public:
    double area() const {
        return static_cast<const Derived*>(this)->area_impl();
    }
};

// 使用模板函式處理
template<typename T>
void processShape(const Shape<T>& s) {
    std::cout << "面積: " << s.area() << "\\n";  // 直接內聯
}
\`\`\`

## Mixin 模式

為類別混入可重用的功能：

\`\`\`cpp
template<typename Derived>
class Printable {
public:
    void print() const {
        std::cout << static_cast<const Derived*>(this)->to_string() << "\\n";
    }
    friend std::ostream& operator<<(std::ostream& os, const Derived& d) {
        return os << d.to_string();
    }
};

class Person : public Printable<Person> {
public:
    std::string to_string() const { return "Person: " + name_; }
};
\`\`\`

## 編譯期介面強制

基底類別可在編譯期強制衍生類別實現介面——如果 Derived 缺少必要方法，編譯時會報錯。

## Barton-Nackman Trick

結合 CRTP 與 friend 函式，自動生成運算子：

\`\`\`cpp
template<typename Derived>
class EqualityComparable {
    friend bool operator==(const Derived& a, const Derived& b) {
        return a.equal_to(b);
    }
    friend bool operator!=(const Derived& a, const Derived& b) {
        return !a.equal_to(b);
    }
};

class Point : public EqualityComparable<Point> {
public:
    bool equal_to(const Point& o) const { return x_ == o.x_ && y_ == o.y_; }
};
\`\`\`

## CRTP vs Concepts (C++20)

C++20 Concepts 在許多場景可取代 CRTP：

\`\`\`cpp
// Concepts 做約束（更簡潔）
template<typename T>
concept Addable = requires(T a, T b) { { a + b } -> std::same_as<T>; };
\`\`\`

**但 CRTP 仍然需要的場景**：注入功能、自動生成程式碼、per-type 靜態資料。

## 實際案例

### std::enable_shared_from_this
\`\`\`cpp
class Widget : public std::enable_shared_from_this<Widget> {
public:
    std::shared_ptr<Widget> getPtr() { return shared_from_this(); }
};
\`\`\`

### Iterator Facade
使用 CRTP 讓自訂迭代器只需實現核心函式（dereference、increment、equal），其餘運算子自動生成。
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
      ],
      solution: `#include <iostream>
#include <string>

template<typename Derived>
class Serializable {
public:
    std::string serialize() const {
        return static_cast<const Derived*>(this)->to_json_impl();
    }
};

class User : public Serializable<User> {
    std::string name_;
    int age_;
public:
    User(const std::string& name, int age) : name_(name), age_(age) {}
    std::string to_json_impl() const {
        return "{\\\"name\\\":\\\"" + name_ + "\\\",\\\"age\\\":" + std::to_string(age_) + "}";
    }
};

class Product : public Serializable<Product> {
    std::string title_;
    int price_;
public:
    Product(const std::string& title, int price) : title_(title), price_(price) {}
    std::string to_json_impl() const {
        return "{\\\"title\\\":\\\"" + title_ + "\\\",\\\"price\\\":" + std::to_string(price_) + "}";
    }
};

int main() {
    User u("Alice", 30);
    Product p("Laptop", 999);

    std::cout << u.serialize() << std::endl;
    std::cout << p.serialize() << std::endl;

    return 0;
}`
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

## 執行緒建立的系統開銷

建立執行緒的成本包括核心呼叫、堆疊分配（每執行緒 1-8 MB）、TLS 初始化等。在高頻任務場景下，建立/銷毀成本可能超過任務本身。

## Work Stealing（工作竊取）

每個 worker 有自己的佇列，空閒時從其他 worker「竊取」任務：

\`\`\`cpp
// 概念示意
void worker(int id) {
    while (!stop_) {
        if (tryPop(myQueue_, task)) { task(); continue; }
        // 自己沒任務，嘗試竊取
        for (auto& q : otherQueues_) {
            if (trySteal(q, task)) { task(); break; }
        }
    }
}
\`\`\`

## 優先佇列排程

\`\`\`cpp
struct PrioritizedTask {
    int priority;
    std::function<void()> task;
    bool operator<(const PrioritizedTask& o) const {
        return priority < o.priority;
    }
};
// 使用 std::priority_queue<PrioritizedTask>
\`\`\`

## 執行緒池大小選擇

- **CPU 密集型**：threads = hardware_concurrency()
- **I/O 密集型**：threads = hardware_concurrency() * 2 或更多
- **混合型**：需要實際測量調整

## 優雅關閉

1. 設定停止旗標  2. notify_all 喚醒 worker  3. 等待進行中任務完成  4. join 所有執行緒

## 任務中的例外處理

使用 \`std::packaged_task\` 包裝任務，例外會被自動捕獲並透過 \`future.get()\` 傳播給呼叫者。

## 使用 std::jthread (C++20)

\`\`\`cpp
class JThreadPool {
    std::vector<std::jthread> workers_;  // 自動 join
public:
    JThreadPool(size_t n) {
        for (size_t i = 0; i < n; ++i) {
            workers_.emplace_back([this](std::stop_token stoken) {
                while (!stoken.stop_requested()) {
                    // 取任務並執行...
                }
            });
        }
    }
    // 不需要手動析構
};
\`\`\`
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
      ],
      solution: `#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <future>

class ThreadPool {
    std::vector<std::thread> workers_;
    std::queue<std::function<void()>> tasks_;
    std::mutex mutex_;
    std::condition_variable cv_;
    bool stop_ = false;
public:
    ThreadPool(size_t numThreads) {
        for (size_t i = 0; i < numThreads; ++i) {
            workers_.emplace_back([this]() {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(mutex_);
                        cv_.wait(lock, [this]{ return stop_ || !tasks_.empty(); });
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
        for (auto& w : workers_) w.join();
    }

    template<typename F, typename... Args>
    auto submit(F&& f, Args&&... args) -> std::future<decltype(f(args...))> {
        using ReturnType = decltype(f(args...));
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

long long range_sum(long long start, long long end) {
    long long sum = 0;
    for (long long i = start; i <= end; ++i) sum += i;
    return sum;
}

int main() {
    long long n;
    std::cin >> n;

    ThreadPool pool(4);
    std::vector<std::future<long long>> futures;

    long long chunk = n / 4;
    for (int i = 0; i < 4; ++i) {
        long long start = i * chunk + 1;
        long long end = (i == 3) ? n : (i + 1) * chunk;
        futures.push_back(pool.submit(range_sum, start, end));
    }

    long long total = 0;
    for (auto& f : futures) {
        total += f.get();
    }

    std::cout << total << std::endl;
    return 0;
}`
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

## ABA 問題

無鎖程式設計中最臭名昭著的問題。執行緒讀到值 A，其他執行緒將 A 改為 B 再改回 A，CAS 誤判為未變化。解決方案包括標記指標（tagged pointer）和 hazard pointers。

## 記憶體順序深入解析

### happens-before 與 synchronizes-with

\`\`\`cpp
std::atomic<bool> ready{false};
int data = 0;

// 執行緒 1
data = 42;
ready.store(true, memory_order_release); // release

// 執行緒 2
while (!ready.load(memory_order_acquire)); // acquire
// 保證看到 data == 42（release synchronizes-with acquire）
\`\`\`

### 各記憶體順序用途

| 順序 | 用途 | 開銷 |
|------|------|------|
| seq_cst | 預設，全局一致 | 最高 |
| acquire | 讀取屏障 | 中 |
| release | 寫入屏障 | 中 |
| acq_rel | acquire + release | 中 |
| relaxed | 只保證原子性 | 最低 |

## compare_exchange_weak vs strong

- **strong**：只在值不等時才失敗
- **weak**：可能「假失敗」，但迴圈中效能更好

**準則**：迴圈中用 weak，單次嘗試用 strong。

## atomic_flag

最基本的原子類型，保證無鎖，常用於自旋鎖：

\`\`\`cpp
class Spinlock {
    std::atomic_flag flag_ = ATOMIC_FLAG_INIT;
public:
    void lock() {
        while (flag_.test_and_set(std::memory_order_acquire));
    }
    void unlock() { flag_.clear(std::memory_order_release); }
};
\`\`\`

## Lock-Free vs Wait-Free

- **Lock-Free**：至少一個執行緒能在有限步驟完成
- **Wait-Free**：每個執行緒都能在有限步驟完成（最強保證）

大多數「無鎖」資料結構是 lock-free 而非 wait-free。

## Hazard Pointers 概念

每個執行緒標記正在存取的指標，回收時檢查：若節點在任何危險清單中則延遲回收，否則安全釋放。

## 實用指南

1. **優先使用 mutex**：無鎖程式設計極難正確實現
2. **簡單計數器**：\`std::atomic\` + relaxed
3. **同步場景**：acquire/release 配對
4. **預設 seq_cst**：只在效能瓶頸時放寬
5. **測試不足以驗證**：並發 bug 可能極難重現
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
      ],
      solution: `#include <iostream>
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

        int old = min_.load();
        while (value < old && !min_.compare_exchange_weak(old, value));

        old = max_.load();
        while (value > old && !max_.compare_exchange_weak(old, value));
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
}`
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

## Stackless vs Stackful 協程

C++20 採用 **stackless** 協程：記憶體輕量（只分配協程框架），但只能在最頂層暫停。相比之下，stackful 協程（如 Boost.Context）需要完整堆疊但可在任何深度暫停。

## 協程框架 (Coroutine Frame)

編譯器為每個協程在堆上分配框架，儲存 promise 物件、參數副本、局部變數與恢復位址。HALO 最佳化可能將框架放在堆疊上。

## promise_type 自訂點詳解

\\\`\\\`\\\`cpp
struct promise_type {
    auto get_return_object();        // 建立回傳物件
    auto initial_suspend();          // suspend_always=惰性, suspend_never=立即
    auto final_suspend() noexcept;   // 結束時暫停？
    void unhandled_exception();      // 例外處理
    void return_void();              // co_return;
    auto yield_value(T);             // co_yield value;
    auto await_transform(expr);      // 自訂 co_await
};
\\\`\\\`\\\`

## Awaitable / Awaiter 介面

co_await 需要 awaiter 物件，定義 await_ready()、await_suspend(handle)、await_resume() 三個方法。await_suspend 的回傳型別控制行為：void 暫停、bool 條件暫停、coroutine_handle 對稱轉移。

## 對稱轉移 (Symmetric Transfer)

await_suspend 回傳 coroutine_handle 可直接恢復另一個協程，避免堆疊溢位，是實現高效排程器的關鍵。

## 實際應用場景

- **非同步 I/O**：co_await async_read() 等待 I/O 完成
- **事件迴圈**：在迴圈中 co_await 各種事件
- **解析器**：使用 co_yield 逐一產出 token
- **惰性序列**：按需生成值，節省記憶體
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
      ],
      solution: `#include <iostream>
#include <coroutine>

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

Generator<int> squares() {
    for (int i = 1; ; ++i) {
        co_yield i * i;
    }
}

Generator<int> take(Generator<int> gen, int n) {
    for (int i = 0; i < n && gen.next(); ++i) {
        co_yield gen.value();
    }
}

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
}`
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

## Stack vs Heap 深入比較

| 特性 | Stack | Heap |
|------|-------|------|
| 配置速度 | 極快（移動指標） | 慢（系統呼叫） |
| 大小限制 | 1-8 MB | 受虛擬記憶體限制 |
| 生命週期 | 自動 | 手動/RAII |
| 碎片 | 無 | 可能嚴重 |
| 快取友善 | ✅ | ❌ |

## 記憶體佈局

程式記憶體從低到高：Text（程式碼）→ Data → BSS → Heap（向上）→ 自由空間 → Stack（向下）。

## alignas / alignof 詳解

\\\`\\\`\\\`cpp
alignof(int);    // 通常 4
alignof(double); // 通常 8

struct alignas(64) CacheLine {
    int data[16];  // 對齊到快取行，避免 false sharing
};
\\\`\\\`\\\`

## 自定義 Allocator 的動機

避免頻繁系統呼叫、控制碎片、池化配置、記憶體追蹤、特殊記憶體（GPU、共享記憶體）。

## Pool Allocator

適合大量相同大小物件。使用 free list 管理，配置/釋放都是 O(1)：

\\\`\\\`\\\`cpp
template<typename T, size_t N>
class PoolAllocator {
    union Block { T data; Block* next; };
    Block pool_[N];
    Block* free_ = nullptr;
public:
    PoolAllocator() {
        for (size_t i = 0; i < N-1; ++i) pool_[i].next = &pool_[i+1];
        pool_[N-1].next = nullptr;
        free_ = &pool_[0];
    }
    T* allocate() {
        auto* b = free_; free_ = free_->next;
        return &b->data;
    }
    void deallocate(T* p) {
        auto* b = reinterpret_cast<Block*>(p);
        b->next = free_; free_ = b;
    }
};
\\\`\\\`\\\`

## Arena Allocator

只配置不釋放，整體一次性銷毀。適合生命週期相同的物件（如 AST 節點）。配置極快，無碎片。

## placement new 詳解

\\\`\\\`\\\`cpp
alignas(Widget) char buf[sizeof(Widget)];
Widget* w = new (buf) Widget(args...);
w->~Widget();  // 必須手動呼叫解構函式

// C++20: std::construct_at / std::destroy_at 更安全
\\\`\\\`\\\`

## Memory-Mapped I/O

將檔案映射到虛擬位址空間，用指標直接存取，由 OS 處理分頁載入。

## RAII 與 PMR (C++17)

\\\`\\\`\\\`cpp
#include <memory_resource>
std::array<char, 4096> buffer;
std::pmr::monotonic_buffer_resource mbr(buffer.data(), buffer.size());
std::pmr::vector<int> vec(&mbr);  // 使用棧上記憶體！
\\\`\\\`\\\`
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
      ],
      solution: `#include <iostream>
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

    void* allocate(size_t bytes) {
        if (offset_ + bytes > capacity_) return nullptr;
        void* ptr = buffer_ + offset_;
        offset_ += bytes;
        return ptr;
    }

    void reset() { offset_ = 0; }

    size_t used() const { return offset_; }
    size_t capacity() const { return capacity_; }
};

int main() {
    StackAllocator alloc(256);

    int* a = static_cast<int*>(alloc.allocate(sizeof(int)));
    int* b = static_cast<int*>(alloc.allocate(sizeof(int)));
    int* c = static_cast<int*>(alloc.allocate(sizeof(int)));

    *a = 10; *b = 20; *c = 30;
    std::cout << *a << " " << *b << " " << *c << std::endl;
    std::cout << "Used: " << alloc.used() << std::endl;

    alloc.reset();
    std::cout << "After reset: " << alloc.used() << std::endl;

    return 0;
}`
    }
  },
  {
    id: 'ipc-pipes-fifo',
    category: 'system-programming',
    title: 'IPC: 管道與命名管道 (Pipes & FIFO)',
    description: '使用 pipe() 和 FIFO 實現進程間通訊，掌握 Unix 管道機制。',
    difficulty: 'advanced',
    content: `# IPC: 管道與命名管道 (Pipes & FIFO)

## 什麼是 IPC？為什麼需要它？

**IPC (Inter-Process Communication，進程間通訊)** 是指不同進程之間交換資料的機制。在 Unix/Linux 系統中，每個進程都有自己獨立的位址空間，無法直接存取其他進程的記憶體。因此，作業系統提供了多種 IPC 機制讓進程能夠協作：

- **管道 (Pipes)**：最簡單的 IPC 機制
- **命名管道 (FIFO)**：具名的管道，允許無親緣關係的進程通訊
- **共享記憶體 (Shared Memory)**：最高效的 IPC 方式
- **Socket**：支援網路通訊的 IPC
- **訊息佇列 (Message Queue)**：結構化的訊息傳遞

## 匿名管道 (Anonymous Pipe)

### 基本概念

匿名管道是最基本的 IPC 機制，它建立一個**單向**的通訊通道：

- 管道有兩端：**讀端 (read end)** 和 **寫端 (write end)**
- 資料從寫端流入，從讀端流出（先進先出 FIFO）
- 只能用於**有親緣關係**的進程（父子進程）

### pipe() 系統呼叫

\`\`\`cpp
#include <unistd.h>

int pipefd[2];
int ret = pipe(pipefd);
// pipefd[0] = 讀端 (read end)
// pipefd[1] = 寫端 (write end)
\`\`\`

### 父子進程通訊流程

1. 父進程呼叫 \`pipe()\` 建立管道
2. 父進程呼叫 \`fork()\` 建立子進程
3. 子進程繼承管道的檔案描述符
4. 根據通訊方向，各自關閉不需要的端

\`\`\`cpp
int pipefd[2];
pipe(pipefd);

pid_t pid = fork();
if (pid == 0) {
    // 子進程：寫入資料
    close(pipefd[0]);  // 關閉讀端
    const char* msg = "Hello from child!";
    write(pipefd[1], msg, strlen(msg));
    close(pipefd[1]);
} else {
    // 父進程：讀取資料
    close(pipefd[1]);  // 關閉寫端
    char buf[256];
    ssize_t n = read(pipefd[0], buf, sizeof(buf) - 1);
    buf[n] = '\\0';
    printf("Parent received: %s\\n", buf);
    close(pipefd[0]);
}
\`\`\`

## 命名管道 (Named Pipe / FIFO)

### 與匿名管道的差異

| 特性 | 匿名管道 | 命名管道 (FIFO) |
|------|---------|----------------|
| 建立方式 | pipe() | mkfifo() 或命令列 mkfifo |
| 可見性 | 只在進程內 | 檔案系統中有路徑名稱 |
| 通訊對象 | 有親緣關係的進程 | 任何進程 |
| 生命週期 | 隨進程結束 | 直到被刪除 |

### 使用 mkfifo

\`\`\`cpp
#include <sys/stat.h>

// 建立命名管道
mkfifo("/tmp/myfifo", 0666);

// 寫端進程
int fd = open("/tmp/myfifo", O_WRONLY);
write(fd, "Hello FIFO!", 11);
close(fd);

// 讀端進程
int fd = open("/tmp/myfifo", O_RDONLY);
char buf[256];
read(fd, buf, sizeof(buf));
close(fd);

// 用完後刪除
unlink("/tmp/myfifo");
\`\`\`

## 管道的緩衝與阻塞行為

- **寫入空管道**：如果沒有讀端開啟，寫入會產生 SIGPIPE 信號
- **讀取空管道**：如果沒有資料且寫端仍開啟，read() 會**阻塞**
- **管道滿時**：write() 會**阻塞**直到有空間（Linux 預設管道大小為 65536 bytes）
- **所有寫端關閉**：read() 返回 0（表示 EOF）

## 雙向通訊：使用兩個管道

由於管道是單向的，雙向通訊需要**兩個管道**：

\`\`\`cpp
int pipe_parent_to_child[2];  // 父→子
int pipe_child_to_parent[2];  // 子→父

pipe(pipe_parent_to_child);
pipe(pipe_child_to_parent);

pid_t pid = fork();
if (pid == 0) {
    // 子進程
    close(pipe_parent_to_child[1]);  // 關閉寫端
    close(pipe_child_to_parent[0]);  // 關閉讀端
    
    // 從父進程讀取
    char buf[256];
    read(pipe_parent_to_child[0], buf, sizeof(buf));
    
    // 回覆父進程
    write(pipe_child_to_parent[1], "Got it!", 7);
    
    close(pipe_parent_to_child[0]);
    close(pipe_child_to_parent[1]);
} else {
    // 父進程
    close(pipe_parent_to_child[0]);  // 關閉讀端
    close(pipe_child_to_parent[1]);  // 關閉寫端
    
    // 發送給子進程
    write(pipe_parent_to_child[1], "Hello!", 6);
    
    // 從子進程讀取回覆
    char buf[256];
    read(pipe_child_to_parent[0], buf, sizeof(buf));
    
    close(pipe_parent_to_child[1]);
    close(pipe_child_to_parent[0]);
}
\`\`\`

## 實際應用

- **Shell 管道**：\`ls | grep .cpp\` 就是用管道連接兩個進程
- **進程間資料流**：一個進程產生資料，另一個處理
- **日誌收集**：子進程的輸出透過管道傳給父進程記錄
- **CGI 程式**：Web 伺服器透過管道與 CGI 程式通訊
`,
    codeExample: `#include <iostream>
#include <unistd.h>
#include <sys/wait.h>
#include <cstring>
#include <string>

// 父子進程透過管道通訊
int main() {
    int pipefd[2];
    if (pipe(pipefd) == -1) {
        perror("pipe");
        return 1;
    }

    pid_t pid = fork();
    if (pid == -1) {
        perror("fork");
        return 1;
    }

    if (pid == 0) {
        // 子進程：寫入資料
        close(pipefd[0]);  // 關閉讀端

        std::string messages[] = {
            "Hello from child!",
            "Message 2",
            "Message 3"
        };

        for (const auto& msg : messages) {
            // 先寫入訊息長度，再寫入訊息內容
            uint32_t len = msg.size();
            write(pipefd[1], &len, sizeof(len));
            write(pipefd[1], msg.c_str(), len);
        }

        close(pipefd[1]);  // 關閉寫端，通知父進程 EOF
        return 0;
    } else {
        // 父進程：讀取資料
        close(pipefd[1]);  // 關閉寫端

        uint32_t len;
        while (read(pipefd[0], &len, sizeof(len)) == sizeof(len)) {
            std::string msg(len, '\\0');
            read(pipefd[0], &msg[0], len);
            std::cout << "Parent received: " << msg << std::endl;
        }

        close(pipefd[0]);
        wait(nullptr);  // 等待子進程結束
        std::cout << "Communication complete" << std::endl;
    }

    return 0;
}`,
    exercise: {
      title: '雙向管道通訊練習',
      description: '實作父子進程之間的雙向通訊：\n1. 父進程從 stdin 讀取一個整數 N\n2. 父進程透過管道發送 N 給子進程\n3. 子進程計算 N 的階乘 (N!)\n4. 子進程透過另一個管道將結果傳回父進程\n5. 父進程輸出結果',
      starterCode: `#include <iostream>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    int pipe1[2];  // 父 -> 子
    int pipe2[2];  // 子 -> 父

    // TODO: 建立兩個管道
    // TODO: fork 子進程
    // TODO: 子進程從 pipe1 讀取 N，計算 N!，寫入 pipe2
    // TODO: 父進程讀取 N，寫入 pipe1，從 pipe2 讀取結果

    return 0;
}`,
      testCases: [
        { input: '5', expectedOutput: '120' },
        { input: '10', expectedOutput: '3628800' },
        { input: '1', expectedOutput: '1' }
      ],
      hints: [
        '記得在 fork 後關閉不需要的管道端',
        '使用 read/write 傳遞整數時，傳遞 &n 和 sizeof(n)',
        '階乘計算：long long factorial = 1; for (int i = 2; i <= n; ++i) factorial *= i;',
        '父進程要先寫入再讀取，子進程要先讀取再寫入'
      ],
      solution: `#include <iostream>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    int pipe1[2];  // 父 -> 子
    int pipe2[2];  // 子 -> 父

    pipe(pipe1);
    pipe(pipe2);

    pid_t pid = fork();

    if (pid == 0) {
        // 子進程
        close(pipe1[1]);  // 關閉 pipe1 寫端
        close(pipe2[0]);  // 關閉 pipe2 讀端

        int n;
        read(pipe1[0], &n, sizeof(n));
        close(pipe1[0]);

        long long factorial = 1;
        for (int i = 2; i <= n; ++i) {
            factorial *= i;
        }

        write(pipe2[1], &factorial, sizeof(factorial));
        close(pipe2[1]);
        return 0;
    } else {
        // 父進程
        close(pipe1[0]);  // 關閉 pipe1 讀端
        close(pipe2[1]);  // 關閉 pipe2 寫端

        int n;
        std::cin >> n;

        write(pipe1[1], &n, sizeof(n));
        close(pipe1[1]);

        long long result;
        read(pipe2[0], &result, sizeof(result));
        close(pipe2[0]);

        std::cout << result << std::endl;

        wait(nullptr);
    }

    return 0;
}`
    }
  },
  {
    id: 'ipc-shared-memory',
    category: 'system-programming',
    title: 'IPC: 共享記憶體與信號量',
    description: '使用 POSIX 共享記憶體 (shm) 和信號量 (semaphore) 進行高效進程間通訊。',
    difficulty: 'advanced',
    content: `# IPC: 共享記憶體與信號量

## 共享記憶體概述

共享記憶體是最快速的 IPC 機制，因為資料不需要在核心空間和使用者空間之間複製。多個進程可以將同一塊實體記憶體映射到各自的虛擬位址空間中，直接讀寫。

**優點**：
- 零拷貝，效能最高
- 適合大量資料傳輸

**缺點**：
- 需要額外的同步機制（如信號量）
- 程式設計較複雜

## POSIX 共享記憶體

### 核心 API

\`\`\`cpp
#include <sys/mman.h>
#include <fcntl.h>

// 1. 建立/開啟共享記憶體物件
int fd = shm_open("/my_shm", O_CREAT | O_RDWR, 0666);

// 2. 設定大小
ftruncate(fd, sizeof(SharedData));

// 3. 映射到進程位址空間
void* ptr = mmap(NULL, sizeof(SharedData),
                 PROT_READ | PROT_WRITE,
                 MAP_SHARED, fd, 0);

// 4. 使用共享記憶體
SharedData* data = static_cast<SharedData*>(ptr);
data->value = 42;

// 5. 解除映射
munmap(ptr, sizeof(SharedData));

// 6. 關閉檔案描述符
close(fd);

// 7. 刪除共享記憶體物件（最後使用的進程負責）
shm_unlink("/my_shm");
\`\`\`

### 共享記憶體結構設計

\`\`\`cpp
struct SharedData {
    int counter;
    char message[256];
    bool ready;
};
\`\`\`

## System V 共享記憶體

較舊的 API，但仍廣泛使用：

\`\`\`cpp
#include <sys/ipc.h>
#include <sys/shm.h>

// 建立
key_t key = ftok("/tmp/shmfile", 65);
int shmid = shmget(key, sizeof(SharedData), 0666 | IPC_CREAT);

// 附加
void* ptr = shmat(shmid, NULL, 0);

// 分離
shmdt(ptr);

// 刪除
shmctl(shmid, IPC_RMID, NULL);
\`\`\`

## POSIX 信號量

信號量用於控制多個進程對共享資源的存取。

### 具名信號量 (Named Semaphore)

適用於**不同進程**之間的同步：

\`\`\`cpp
#include <semaphore.h>

// 建立/開啟具名信號量
sem_t* sem = sem_open("/my_sem", O_CREAT, 0666, 1);
// 初始值為 1 = 二元信號量（互斥鎖）

// 等待（P 操作）：值 > 0 則減 1 並返回，否則阻塞
sem_wait(sem);

// 臨界區操作...

// 釋放（V 操作）：值加 1，喚醒一個等待的進程
sem_post(sem);

// 關閉
sem_close(sem);

// 刪除（最後一個使用者負責）
sem_unlink("/my_sem");
\`\`\`

### 無名信號量 (Unnamed Semaphore)

適用於**共享記憶體中**的進程同步：

\`\`\`cpp
struct SharedData {
    sem_t sem;
    int value;
};

// 在共享記憶體中初始化
// 第二個參數 1 表示進程間共享
sem_init(&shared->sem, 1, 1);

// 使用
sem_wait(&shared->sem);
shared->value++;
sem_post(&shared->sem);

// 銷毀
sem_destroy(&shared->sem);
\`\`\`

## 共享記憶體 + 信號量：完整模式

### 生產者-消費者模式

\`\`\`cpp
struct SharedBuffer {
    sem_t mutex;      // 互斥鎖
    sem_t full;       // 已填充的槽位數
    sem_t empty;      // 空閒的槽位數
    int buffer[10];   // 環形緩衝區
    int in;           // 寫入位置
    int out;          // 讀取位置
};

// 生產者
sem_wait(&buf->empty);   // 等待空閒槽位
sem_wait(&buf->mutex);   // 進入臨界區
buf->buffer[buf->in] = item;
buf->in = (buf->in + 1) % 10;
sem_post(&buf->mutex);   // 離開臨界區
sem_post(&buf->full);    // 增加已填充計數

// 消費者
sem_wait(&buf->full);    // 等待已填充槽位
sem_wait(&buf->mutex);   // 進入臨界區
int item = buf->buffer[buf->out];
buf->out = (buf->out + 1) % 10;
sem_post(&buf->mutex);   // 離開臨界區
sem_post(&buf->empty);   // 增加空閒計數
\`\`\`

## 記憶體映射檔案 (Memory-Mapped Files)

\`mmap\` 也可以用於映射一般檔案，實現檔案的高效存取：

\`\`\`cpp
// 映射檔案
int fd = open("data.bin", O_RDWR);
struct stat st;
fstat(fd, &st);

void* ptr = mmap(NULL, st.st_size,
                 PROT_READ | PROT_WRITE,
                 MAP_SHARED, fd, 0);

// 直接操作記憶體 = 操作檔案
memcpy(ptr, data, size);

// 同步到磁碟
msync(ptr, st.st_size, MS_SYNC);

munmap(ptr, st.st_size);
close(fd);
\`\`\`

## 實際應用模式

- **資料庫引擎**：使用共享記憶體做快取池
- **高頻交易**：進程間低延遲資料傳遞
- **多進程伺服器**：共享設定和狀態
- **科學計算**：大型資料集的進程間共享
- **遊戲引擎**：多進程架構中共享遊戲狀態

## 注意事項

1. **同步是必須的**：共享記憶體本身不提供同步，必須搭配信號量或其他同步機制
2. **記憶體對齊**：共享結構體要注意記憶體對齊
3. **清理資源**：使用 shm_unlink 和 sem_unlink 避免資源洩漏
4. **錯誤處理**：每個系統呼叫都應檢查返回值
5. **編譯旗標**：需要加上 \`-lrt -lpthread\` 連結選項
`,
    codeExample: `#include <iostream>
#include <cstring>
#include <sys/mman.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <semaphore.h>

struct SharedData {
    sem_t sem;
    int counter;
    char message[256];
};

int main() {
    const char* shm_name = "/demo_shm";
    const int SHM_SIZE = sizeof(SharedData);

    // 建立共享記憶體
    int fd = shm_open(shm_name, O_CREAT | O_RDWR, 0666);
    ftruncate(fd, SHM_SIZE);

    // 映射
    SharedData* shared = static_cast<SharedData*>(
        mmap(NULL, SHM_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0)
    );
    close(fd);

    // 初始化信號量（進程間共享，初始值 1）
    sem_init(&shared->sem, 1, 1);
    shared->counter = 0;
    std::strcpy(shared->message, "Initial");

    pid_t pid = fork();

    if (pid == 0) {
        // 子進程：遞增計數器 1000 次
        for (int i = 0; i < 1000; ++i) {
            sem_wait(&shared->sem);
            shared->counter++;
            sem_post(&shared->sem);
        }

        sem_wait(&shared->sem);
        std::strcpy(shared->message, "Updated by child");
        sem_post(&shared->sem);

        munmap(shared, SHM_SIZE);
        return 0;
    } else {
        // 父進程：也遞增計數器 1000 次
        for (int i = 0; i < 1000; ++i) {
            sem_wait(&shared->sem);
            shared->counter++;
            sem_post(&shared->sem);
        }

        wait(nullptr);  // 等待子進程結束

        sem_wait(&shared->sem);
        std::cout << "Counter: " << shared->counter << std::endl;
        std::cout << "Message: " << shared->message << std::endl;
        sem_post(&shared->sem);

        // 清理
        sem_destroy(&shared->sem);
        munmap(shared, SHM_SIZE);
        shm_unlink(shm_name);
    }

    return 0;
}`,
    exercise: {
      title: '共享計數器練習',
      description: '實作父子進程之間的共享計數器：\n1. 建立 POSIX 共享記憶體，包含一個計數器和一個信號量\n2. 父進程讀取 N，然後 fork 子進程\n3. 父進程將計數器加 N 次（每次加 1）\n4. 子進程也將計數器加 N 次（每次加 1）\n5. 等待子進程結束後，輸出最終計數器值（應為 2*N）',
      starterCode: `#include <iostream>
#include <sys/mman.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <semaphore.h>

struct SharedData {
    sem_t sem;
    int counter;
};

int main() {
    int n;
    std::cin >> n;

    // TODO: 建立共享記憶體
    // TODO: 映射並初始化 SharedData
    // TODO: fork 子進程
    // TODO: 父子進程各加 N 次
    // TODO: 輸出最終結果

    return 0;
}`,
      testCases: [
        { input: '1000', expectedOutput: '2000' },
        { input: '500', expectedOutput: '1000' },
        { input: '1', expectedOutput: '2' }
      ],
      hints: [
        'shm_open 搭配 O_CREAT | O_RDWR 建立共享記憶體',
        'ftruncate 設定共享記憶體大小為 sizeof(SharedData)',
        'sem_init 第二個參數設為 1 表示進程間共享',
        '每次遞增前 sem_wait，遞增後 sem_post',
        '編譯時加上 -lrt -lpthread'
      ],
      solution: `#include <iostream>
#include <sys/mman.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <semaphore.h>

struct SharedData {
    sem_t sem;
    int counter;
};

int main() {
    int n;
    std::cin >> n;

    const char* shm_name = "/exercise_shm";
    int fd = shm_open(shm_name, O_CREAT | O_RDWR, 0666);
    ftruncate(fd, sizeof(SharedData));

    SharedData* shared = static_cast<SharedData*>(
        mmap(NULL, sizeof(SharedData), PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0)
    );
    close(fd);

    sem_init(&shared->sem, 1, 1);
    shared->counter = 0;

    pid_t pid = fork();

    if (pid == 0) {
        for (int i = 0; i < n; ++i) {
            sem_wait(&shared->sem);
            shared->counter++;
            sem_post(&shared->sem);
        }
        munmap(shared, sizeof(SharedData));
        return 0;
    } else {
        for (int i = 0; i < n; ++i) {
            sem_wait(&shared->sem);
            shared->counter++;
            sem_post(&shared->sem);
        }

        wait(nullptr);
        std::cout << shared->counter << std::endl;

        sem_destroy(&shared->sem);
        munmap(shared, sizeof(SharedData));
        shm_unlink(shm_name);
    }

    return 0;
}`
    }
  },
  {
    id: 'ipc-socket-programming',
    category: 'system-programming',
    title: 'IPC: Socket 程式設計',
    description: '使用 Unix Domain Socket 和 TCP Socket 進行進程間與網路通訊。',
    difficulty: 'advanced',
    content: `# IPC: Socket 程式設計

## Socket 概述

Socket（套接字）是最通用的 IPC 機制，不僅可以用於同一台機器上的進程間通訊，還可以跨網路通訊。

### Socket 類型

| 類型 | 說明 | 適用場景 |
|------|------|---------|
| Unix Domain Socket | 本機進程間通訊，使用檔案路徑作為位址 | 高效本機 IPC |
| TCP Socket | 面向連線的可靠傳輸 | 網路通訊、客戶端-伺服器 |
| UDP Socket | 無連線的資料報傳輸 | 即時通訊、串流媒體 |

## Socket API 核心函式

\`\`\`cpp
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

// 建立 socket
int sockfd = socket(AF_INET, SOCK_STREAM, 0);
// AF_INET: IPv4, AF_UNIX: Unix Domain
// SOCK_STREAM: TCP, SOCK_DGRAM: UDP

// 伺服器端
bind(sockfd, addr, addrlen);      // 綁定位址
listen(sockfd, backlog);          // 開始監聽
int client = accept(sockfd, ...); // 接受連線

// 客戶端
connect(sockfd, addr, addrlen);   // 連線到伺服器

// 資料傳輸
send(sockfd, buf, len, flags);    // 發送
recv(sockfd, buf, len, flags);    // 接收

// 關閉
close(sockfd);
\`\`\`

## TCP 客戶端-伺服器模型

### 伺服器端流程

\`\`\`cpp
// 1. 建立 socket
int server_fd = socket(AF_INET, SOCK_STREAM, 0);

// 2. 設定 SO_REUSEADDR（避免 "Address already in use"）
int opt = 1;
setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

// 3. 綁定位址
struct sockaddr_in addr;
addr.sin_family = AF_INET;
addr.sin_addr.s_addr = INADDR_ANY;
addr.sin_port = htons(8080);
bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));

// 4. 開始監聽
listen(server_fd, 5);

// 5. 接受連線
struct sockaddr_in client_addr;
socklen_t client_len = sizeof(client_addr);
int client_fd = accept(server_fd,
    (struct sockaddr*)&client_addr, &client_len);

// 6. 收發資料
char buf[1024];
ssize_t n = recv(client_fd, buf, sizeof(buf), 0);
send(client_fd, buf, n, 0);  // echo back

// 7. 關閉
close(client_fd);
close(server_fd);
\`\`\`

### 客戶端流程

\`\`\`cpp
// 1. 建立 socket
int sockfd = socket(AF_INET, SOCK_STREAM, 0);

// 2. 連線到伺服器
struct sockaddr_in addr;
addr.sin_family = AF_INET;
addr.sin_port = htons(8080);
inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);
connect(sockfd, (struct sockaddr*)&addr, sizeof(addr));

// 3. 收發資料
send(sockfd, "Hello", 5, 0);
char buf[1024];
recv(sockfd, buf, sizeof(buf), 0);

// 4. 關閉
close(sockfd);
\`\`\`

## Unix Domain Socket

用於同一台機器的高效 IPC，比 TCP 快（無需經過網路協定棧）：

\`\`\`cpp
#include <sys/un.h>

// 伺服器
int server_fd = socket(AF_UNIX, SOCK_STREAM, 0);

struct sockaddr_un addr;
addr.sun_family = AF_UNIX;
strncpy(addr.sun_path, "/tmp/my_socket", sizeof(addr.sun_path) - 1);
unlink("/tmp/my_socket");  // 確保路徑不存在

bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));
listen(server_fd, 5);

// 客戶端
int sockfd = socket(AF_UNIX, SOCK_STREAM, 0);
connect(sockfd, (struct sockaddr*)&addr, sizeof(addr));
\`\`\`

## 非阻塞 Socket 與 I/O 多工

### select / poll / epoll

處理多個客戶端連線時，有三種主要方式：

\`\`\`cpp
// 1. select（跨平台，但有 FD_SETSIZE 限制）
fd_set readfds;
FD_ZERO(&readfds);
FD_SET(server_fd, &readfds);
select(max_fd + 1, &readfds, NULL, NULL, &timeout);

// 2. poll（無 fd 數量限制）
struct pollfd fds[MAX_CLIENTS];
fds[0].fd = server_fd;
fds[0].events = POLLIN;
poll(fds, nfds, timeout_ms);

// 3. epoll（Linux 專用，最高效）
int epfd = epoll_create1(0);
struct epoll_event ev;
ev.events = EPOLLIN;
ev.data.fd = server_fd;
epoll_ctl(epfd, EPOLL_CTL_ADD, server_fd, &ev);

struct epoll_event events[MAX_EVENTS];
int n = epoll_wait(epfd, events, MAX_EVENTS, timeout_ms);
\`\`\`

## 簡單的通訊協議設計

在 TCP 上傳輸資料時，需要處理**訊息邊界**問題（TCP 是位元組流）：

\`\`\`cpp
// 方法 1：固定長度標頭 + 變長資料
struct MessageHeader {
    uint32_t length;  // 資料部分的長度
    uint16_t type;    // 訊息類型
};

// 發送
void send_message(int fd, uint16_t type,
                  const void* data, uint32_t len) {
    MessageHeader hdr = {htonl(len), htons(type)};
    send(fd, &hdr, sizeof(hdr), 0);
    send(fd, data, len, 0);
}

// 方法 2：分隔符號（如換行符）
// 適合文字協議，如 HTTP、SMTP
\`\`\`

## 錯誤處理

\`\`\`cpp
// 每個系統呼叫都應檢查錯誤
int sockfd = socket(AF_INET, SOCK_STREAM, 0);
if (sockfd == -1) {
    perror("socket");
    return -1;
}

if (connect(sockfd, (struct sockaddr*)&addr, sizeof(addr)) == -1) {
    perror("connect");
    close(sockfd);
    return -1;
}

// recv 返回 0 表示對端關閉連線
ssize_t n = recv(sockfd, buf, sizeof(buf), 0);
if (n == 0) {
    // 連線已關閉
} else if (n == -1) {
    perror("recv");
}
\`\`\`

## 實際應用

- **Web 伺服器**：Nginx、Apache 使用 epoll/kqueue 處理大量連線
- **資料庫**：MySQL、PostgreSQL 使用 Socket 接受客戶端連線
- **微服務通訊**：gRPC 基於 HTTP/2 (TCP Socket)
- **容器通訊**：Docker daemon 使用 Unix Domain Socket
- **Redis**：支援 TCP 和 Unix Domain Socket 兩種連線方式

## 編譯注意事項

Socket 程式通常不需要額外的連結旗標（Linux 上）。但如果使用了 pthread，需要加 \`-pthread\`。
`,
    codeExample: `#include <iostream>
#include <cstring>
#include <string>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <sys/wait.h>

// TCP Echo Server/Client 示範
// 使用 fork 在同一程式中同時運行 server 和 client

void run_server(int port, int num_clients) {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);

    bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));
    listen(server_fd, 5);

    for (int i = 0; i < num_clients; ++i) {
        int client_fd = accept(server_fd, nullptr, nullptr);

        char buf[1024];
        ssize_t n = recv(client_fd, buf, sizeof(buf) - 1, 0);
        if (n > 0) {
            buf[n] = '\0';
            std::cout << "Server received: " << buf << std::endl;

            // Echo back with prefix
            std::string reply = std::string("Echo: ") + buf;
            send(client_fd, reply.c_str(), reply.size(), 0);
        }
        close(client_fd);
    }

    close(server_fd);
}

void run_client(int port, const std::string& message) {
    usleep(100000);  // 等待 server 啟動

    int sockfd = socket(AF_INET, SOCK_STREAM, 0);

    struct sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);

    connect(sockfd, (struct sockaddr*)&addr, sizeof(addr));
    send(sockfd, message.c_str(), message.size(), 0);

    char buf[1024];
    ssize_t n = recv(sockfd, buf, sizeof(buf) - 1, 0);
    if (n > 0) {
        buf[n] = '\0';
        std::cout << "Client received: " << buf << std::endl;
    }

    close(sockfd);
}

int main() {
    const int PORT = 9876;

    pid_t pid = fork();

    if (pid == 0) {
        // 子進程作為 client
        run_client(PORT, "Hello, Server!");
        return 0;
    } else {
        // 父進程作為 server
        run_server(PORT, 1);
        wait(nullptr);
    }

    return 0;
}`,
    exercise: {
      title: 'Socket 計算服務練習',
      description: '實作一個簡單的 TCP 計算伺服器：\n1. 伺服器監聽指定 port\n2. 客戶端發送兩個整數（以空格分隔）\n3. 伺服器計算兩數之和，將結果回傳\n4. 客戶端收到結果後輸出\n\n使用 fork 讓 server 和 client 在同一程式中運行。\n從 stdin 讀取兩個整數。',
      starterCode: `#include <iostream>
#include <cstring>
#include <string>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <sys/wait.h>

void run_server(int port) {
    // TODO: 建立 TCP server
    // TODO: 接受連線，讀取兩個數字，計算和，回傳結果
}

void run_client(int port, int a, int b) {
    // TODO: 連線到 server
    // TODO: 發送 "a b"，接收並輸出結果
}

int main() {
    int a, b;
    std::cin >> a >> b;

    const int PORT = 9877;
    pid_t pid = fork();

    if (pid == 0) {
        usleep(100000);
        run_client(PORT, a, b);
        return 0;
    } else {
        run_server(PORT);
        wait(nullptr);
    }

    return 0;
}`,
      testCases: [
        { input: '3 5', expectedOutput: '8' },
        { input: '100 200', expectedOutput: '300' },
        { input: '-10 10', expectedOutput: '0' }
      ],
      hints: [
        '伺服器用 socket + bind + listen + accept',
        '記得設定 SO_REUSEADDR 避免位址佔用錯誤',
        '客戶端用 socket + connect，記得 usleep 等 server 啟動',
        '用 std::to_string 將數字轉成字串發送',
        '用 std::stoi 或 sscanf 解析收到的字串'
      ],
      solution: `#include <iostream>
#include <cstring>
#include <string>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <sys/wait.h>

void run_server(int port) {
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(port);

    bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));
    listen(server_fd, 5);

    int client_fd = accept(server_fd, nullptr, nullptr);

    char buf[1024];
    ssize_t n = recv(client_fd, buf, sizeof(buf) - 1, 0);
    buf[n] = '\\0';

    int a, b;
    sscanf(buf, "%d %d", &a, &b);
    int sum = a + b;

    std::string result = std::to_string(sum);
    send(client_fd, result.c_str(), result.size(), 0);

    close(client_fd);
    close(server_fd);
}

void run_client(int port, int a, int b) {
    usleep(100000);

    int sockfd = socket(AF_INET, SOCK_STREAM, 0);

    struct sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);

    connect(sockfd, (struct sockaddr*)&addr, sizeof(addr));

    std::string msg = std::to_string(a) + " " + std::to_string(b);
    send(sockfd, msg.c_str(), msg.size(), 0);

    char buf[1024];
    ssize_t n = recv(sockfd, buf, sizeof(buf) - 1, 0);
    buf[n] = '\\0';
    std::cout << buf << std::endl;

    close(sockfd);
}

int main() {
    int a, b;
    std::cin >> a >> b;

    const int PORT = 9877;
    pid_t pid = fork();

    if (pid == 0) {
        run_client(PORT, a, b);
        return 0;
    } else {
        run_server(PORT);
        wait(nullptr);
    }

    return 0;
}`
    }
  },
];
