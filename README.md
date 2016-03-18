![MaDnh](/logo.png)

# MaDnhJS

Thư viện các công cụ tiện ích khi làm việc với Javascript. Được xây dựng dựa trên [UnderscoreJS](http://underscorejs.org) **v1.8.3**.

## Cài đặt
---

MaDnhJS cần có UnderscoreJS để hoạt động. Có thể cài riêng UnderscoreJS hoặc sử dụng bản MaDnhJS đã đính kèm UnderscoreJS

<div class="alert alert-success">
Tuy không bắt buộc nhưng MaDnhJS cung cấp một số tính năng hỗ trợ thực thi JS động, nên cần được đặt ở trong tag `head`, trước khi load các scripts khác.
</div>

### Cài đặt riêng UnderscoreJS

 ```xml
<script scr="http://underscorejs.org/underscore-min.js"></script>
<script scr="script/madnhjs/madnh.min.js"></script>
```
 
### Cài đặt bản đính kèm

```xml
<script scr="script/madnhjs/underscore_madnh.min.js"></script>
```

## Cấu trúc
---
MaDnhJS cấu trúc gồm 2 phần:
1. Core: các hàm tiện ích
2. Extensions : các thành phần mở rộng
 * Core extensions: thành phần mở rộng thuộc core
 * Các extensions khác
 
Core và Core extensions được chứa chung một file MaDnhJS, các extensions khác chứa ở thư mục extensions

```
dist/build/
├── extensions/
│   ├── các thành phần mở rộng
│   ├── ....
│
├── madnh.min.js -> core và core extensions 
└── underscore_madnh.min.js -> MaDnhJS đính kèm UnderscoreJS
```

## Sử dụng
---
### Tiền tố
Ngoại trừ object `_.App` thì tất cả các core method, core extensions của MaDnh đều được gọi với tiền tố `_.M`, ví dụ:

* `_.M.loop`
* `_.M.removeItem`
* `_.M.nextID`
* `_.M.EventEmitter`

Đa số các extension khác cũng được gọi với tiền tố `_.M` như `_.M.Dialog`, `_.M.Template`, tất nhiên việc này là không bắt buộc và hoàn toàn phụ thuộc vào bản thân extension đó.

### Constant
Các hằng số là các giá trị gắn vào object `_.M` và không thể thay đổi, được khai báo bằng hàm `_.M.defineConstant`

```
_.M.defineConstant('FOO', 'bar');
```
Truy cập một hằng số đã tồn tại

```
alert(_.M.FOO); //bar
```

Kiểm tra 1 hằng số có tồn tại bằng hàm `_.M.isDefinedConstant`
```
_.M.isDefinedConstant('FOO'); //true
_.M.isDefinedConstant('BAR'); //false
```

Các constant luôn ở dạng IN HOA
```
_.M.defineConstant('baz', 'foo');
_.M.isDefinedConstant('baz'); //false
_.M.isDefinedConstant('BAZ'); //true
```

### Core functions
MaDnhJS cung cấp một số hàm tiện ích sau, xem API để biết danh sách

### Core extensions

Core extensions được lưu cùng file với các core functions 
 
* _.M.FLAG
* _.M.WAITER
* _.M.BaseClass
* _.M.ContentManager
* _.M.Priority
* _.M.EventEmitter
* _.M.CACHE
* _.M.AJAX
* _.M.App
* _.M.AJAXResponseAdapter

### Các extensions đính kèm

Có một số extension đính kèm với MaDnhJS, lưu ở thư mục `/extensions`

* _.M.TAG
* _.M.TEMPLATE
* _.M.LIST
* _.M.JFORM
* _.M.Dialog
