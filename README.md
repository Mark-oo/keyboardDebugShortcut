# Debug Shortcut Extension - README
![Debug Shortcut Example](images/edgy_meme.jpg)

## Overview

This extension provides a simple and efficient way to insert debugging statements in various programming languages using a quick keyboard shortcut.

### How to Use

1. **Select** the variable you want to include in your debug statement.  
2. **Press** `CTRL + ALT + H` to insert the corresponding debug statement directly below the selected text.

---

## Features

- Automatically generates debugging statements in over 15 programming languages.  
- Supports popular languages like PHP, JavaScript, Python, Ruby, and more.

### Supported Languages:
- **PHP**: `var_dump`, `dd` (Laravel), and Blade (`@dd`).
- **JavaScript**: `console.log`.
- **Python**: `print`.
- **Ruby**: `p`.
- **C#**: `Console.WriteLine`.
- **Java**: `System.out.println`.
- **Go**: `fmt.Println`.
- **Swift**: `print`.
- **Rust**: `println!`.
- **Kotlin**: `println`.
- **Perl**: `print`.
- **Lua**: `print`.
- **R**: `print`.
- **Elixir**: `IO.inspect`.
- **Haskell**: `print`.
- **Dart**: `print`.
- **Scala**: `println`.

---

## Known Issues

- Selecting multiple variables on the **same line** or across **multiple lines** may cause unexpected behavior or incorrect formatting.  
  _Recommendation_: Avoid selecting more than one variable at a time.

---

## Release Notes

### 1.0.0
- Initial release with basic functionality.  
- Includes support for debug statements in a wide range of programming languages.

### Future Updates
- Smarter handling of loops and conditional statements to predict where to insert debug statements effectively.

---

**Enjoy Debugging More Efficiently!**
