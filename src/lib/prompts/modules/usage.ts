// src/lib/prompts/modules/usage.ts
// 사용법 분석 관련 프롬프트 모듈 - 개선 버전

export function getUsageAnalysisPrompt(): string {
  return `6. Usage Examples:
   - Extract only verifiable integration/linking examples for the library or project
   - For libraries, focus on how to include/link them in other projects
   - DO NOT guess or infer the API usage details without explicit evidence
   - Format all examples as markdown code blocks with appropriate language tags
   - Make sure each code block starts with \`\`\` and language specifier, then a line break
   - Each command or code statement should be on its own line with proper indentation
   - Make sure to properly terminate code blocks with \`\`\` on a new line
   - If no clear integration instructions are found, return an empty array`;
}

/**
 * 파일 유형에 따른 사용법 지시사항 생성
 */
export function getUsageInstructions(fileName: string): string {
  const lowercaseName = fileName.toLowerCase();
  
  // 파일 확장자별 특화 프롬프트 반환
  if (lowercaseName === 'cmakelists.txt' || lowercaseName.endsWith('.cmake')) {
    return getCMakeUsageInstructions();
  } else if (lowercaseName === 'package.json') {
    return getNpmUsageInstructions();
  } else if (lowercaseName.endsWith('.gradle') || lowercaseName.endsWith('.gradle.kts')) {
    return getGradleUsageInstructions();
  } else if (lowercaseName === 'pom.xml') {
    return getMavenUsageInstructions();
  } else if (lowercaseName === 'requirements.txt' || lowercaseName === 'setup.py') {
    return getPythonUsageInstructions();
  } else if (lowercaseName === 'cargo.toml') {
    return getRustUsageInstructions();
  } else if (lowercaseName === 'go.mod') {
    return getGoUsageInstructions();
  } else if (lowercaseName === 'gemfile') {
    return getRubyUsageInstructions();
  } else if (lowercaseName === 'composer.json') {
    return getPHPUsageInstructions();
  } else if (lowercaseName === 'pubspec.yaml' || lowercaseName === 'pubspec.yml') {
    return getDartFlutterUsageInstructions();
  }
  
  return getUsageAnalysisPrompt();
}

// CMake 사용법 지시사항
function getCMakeUsageInstructions(): string {
  return `
USAGE INSTRUCTIONS FOR CMAKE PROJECT:
When extracting usage information from CMake projects:

1. Determine if this is a library project by checking for:
   - add_library() calls
   - install() commands for library targets

2. For library projects, provide ONLY:
   - How to find and link the library in another CMake project
   - Required include directories
   - NO detailed API usage unless explicitly documented

3. Example format for library usage in CMake:
   \`\`\`cmake
# Find the package
find_package(LibraryName REQUIRED)

# Create your executable
add_executable(your_app main.cpp)

# Link against the library
target_link_libraries(your_app PRIVATE LibraryName)

# Include necessary directories if needed
target_include_directories(your_app PRIVATE \${LibraryName_INCLUDE_DIRS})
   \`\`\`

4. Code block formatting requirements:
   - Always use proper markdown code blocks with language specifier (cmake)
   - Place code on the line AFTER the opening backticks
   - Each command should be on its own line with appropriate comments
   - Use consistent indentation throughout code examples
   - End code blocks with \`\`\` on its own line

5. Important:
   - If the library name can be determined from the CMakeLists.txt, use it in the examples
   - If specific include directories are defined, mention them
   - DO NOT guess or infer API usage without documented examples
   - If no integration instructions can be determined, return an empty array`;
}

// Node.js/NPM 사용법 지시사항
function getNpmUsageInstructions(): string {
  return `
USAGE INSTRUCTIONS FOR NPM PROJECT:
When extracting usage information from package.json files:

1. Determine if this is a library project by checking for:
   - A "main" field without a "bin" field
   - Keywords suggesting it's a library
   - Missing "private": true declaration

2. For library projects, provide ONLY:
   - How to install the package
   - How to import it in code
   - NO detailed API usage unless explicitly documented

3. Example format for package installation:
   \`\`\`bash
npm install package-name
# or
yarn add package-name
   \`\`\`

4. Example format for basic import:
   \`\`\`js
// CommonJS import
const packageName = require('package-name');

// ES Module import
import packageName from 'package-name';
   \`\`\`

5. Code block formatting requirements:
   - Always use proper markdown code blocks with language specifier (js, ts, bash)
   - Place code on the line AFTER the opening backticks
   - Each statement should be on its own line with appropriate comments
   - Use consistent indentation throughout code examples
   - End code blocks with \`\`\` on its own line

6. Important:
   - Use the actual package name from the package.json
   - Only include documented exports (from "main" or "exports" fields)
   - DO NOT guess or infer API usage without documented examples
   - If no integration instructions can be determined, return an empty array`;
}

// Gradle/Android 사용법 지시사항
function getGradleUsageInstructions(): string {
  return `
USAGE INSTRUCTIONS FOR GRADLE/ANDROID PROJECT:
When extracting usage information from Gradle files:

1. Determine if this is a library project by checking for:
   - com.android.library or java-library plugins
   - maven-publish or publishing plugins
   - Absence of application plugins

2. For library projects, provide ONLY:
   - How to include the library in another project's build.gradle
   - Required configuration settings
   - NO detailed API usage unless explicitly documented

3. Example format for library usage in Gradle:
   \`\`\`gradle
// In settings.gradle (for local module)
include ':library-module-name'

// In app's build.gradle (for local module)
dependencies {
    implementation project(':library-module-name')
}

// In app's build.gradle (for published library)
dependencies {
    implementation 'group.id:artifact-id:version'
}
   \`\`\`

4. Code block formatting requirements:
   - Always use proper markdown code blocks with language specifier (gradle)
   - Place code on the line AFTER the opening backticks
   - Each statement should be on its own line with appropriate comments
   - Use consistent indentation throughout code examples
   - End code blocks with \`\`\` on its own line

5. Important:
   - Use actual group/artifact IDs if published
   - Use actual module name if local
   - DO NOT guess or infer API usage without documented examples
   - If no integration instructions can be determined, return an empty array`;
}

// Maven 사용법 지시사항
function getMavenUsageInstructions(): string {
  return `
USAGE INSTRUCTIONS FOR MAVEN PROJECT:
When extracting usage information from Maven POM files:

1. Determine if this is a library project by checking for:
   - packaging types like "jar", "aar", "war" (not "pom")
   - Absence of mainClass or similar application indicators

2. For library projects, provide ONLY:
   - How to include the dependency in another project's pom.xml
   - Required configuration settings
   - NO detailed API usage unless explicitly documented

3. Example format for dependency inclusion:
   \`\`\`xml
<dependency>
    <groupId>group.id</groupId>
    <artifactId>artifact-id</artifactId>
    <version>version</version>
</dependency>
   \`\`\`

4. Code block formatting requirements:
   - Always use proper markdown code blocks with language specifier (xml)
   - Place code on the line AFTER the opening backticks
   - Each XML element should be properly indented
   - Use consistent indentation throughout code examples
   - End code blocks with \`\`\` on its own line

5. Important:
   - Use actual groupId/artifactId/version from the POM
   - DO NOT guess or infer API usage without documented examples
   - If no integration instructions can be determined, return an empty array`;
}

// Python 사용법 지시사항
function getPythonUsageInstructions(): string {
  return `
USAGE INSTRUCTIONS FOR PYTHON PROJECT:
When extracting usage information from Python project files:

1. Determine if this is a library project by checking for:
   - setup.py with no entry_points.console_scripts
   - Package structure rather than application structure

2. For library projects, provide ONLY:
   - How to install the package
   - How to import it in code
   - NO detailed API usage unless explicitly documented

3. Example format for package installation:
   \`\`\`bash
pip install package-name
# or
python -m pip install package-name
   \`\`\`

4. Example format for basic import:
   \`\`\`python
import package_name
# or
from package_name import module
   \`\`\`

5. Code block formatting requirements:
   - Always use proper markdown code blocks with language specifier (python, bash)
   - Place code on the line AFTER the opening backticks
   - Each statement should be on its own line with appropriate comments
   - Use consistent indentation throughout code examples
   - End code blocks with \`\`\` on its own line

6. Important:
   - Use the actual package name from setup.py
   - DO NOT guess or infer API usage without documented examples
   - If no integration instructions can be determined, return an empty array`;
}

// Rust 사용법 지시사항
function getRustUsageInstructions(): string {
  return `
USAGE INSTRUCTIONS FOR RUST PROJECT:
When extracting usage information from Cargo.toml files:

1. Determine if this is a library project by checking for:
   - [lib] section
   - Absence of [[bin]] sections

2. For library projects, provide ONLY:
   - How to add the crate as a dependency
   - How to import it in code
   - NO detailed API usage unless explicitly documented

3. Example format for dependency inclusion:
   \`\`\`toml
[dependencies]
crate-name = "version"
   \`\`\`

4. Example format for basic import:
   \`\`\`rust
use crate_name::module;
   \`\`\`

5. Code block formatting requirements:
   - Always use proper markdown code blocks with language specifier (toml, rust)
   - Place code on the line AFTER the opening backticks
   - Each statement should be on its own line with appropriate comments
   - Use consistent indentation throughout code examples
   - End code blocks with \`\`\` on its own line

6. Important:
   - Use the actual crate name from Cargo.toml
   - DO NOT guess or infer API usage without documented examples
   - If no integration instructions can be determined, return an empty array`;
}

// Go 사용법 지시사항
function getGoUsageInstructions(): string {
  return `
USAGE INSTRUCTIONS FOR GO PROJECT:
When extracting usage information from go.mod files:

1. Determine if this is a library project by checking for:
   - Absence of "main" package in root
   - Package structure rather than command structure

2. For library projects, provide ONLY:
   - How to add the module as a dependency
   - How to import it in code
   - NO detailed API usage unless explicitly documented

3. Example format for dependency inclusion:
   \`\`\`bash
go get github.com/username/module
   \`\`\`

4. Example format for basic import:
   \`\`\`go
import "github.com/username/module"
// or
import (
    "github.com/username/module"
    "github.com/username/module/subpackage"
)
   \`\`\`

5. Code block formatting requirements:
   - Always use proper markdown code blocks with language specifier (go, bash)
   - Place code on the line AFTER the opening backticks
   - Each statement should be on its own line with appropriate comments
   - Use consistent indentation throughout code examples
   - End code blocks with \`\`\` on its own line

6. Important:
   - Use the actual module path from go.mod
   - DO NOT guess or infer API usage without documented examples
   - If no integration instructions can be determined, return an empty array`;
}

// Ruby 사용법 지시사항
function getRubyUsageInstructions(): string {
  return `
USAGE INSTRUCTIONS FOR RUBY PROJECT:
When extracting usage information from Gemfile/gemspec files:

1. Determine if this is a library project by checking for:
   - .gemspec file existence or references
   - Gem structure rather than application structure

2. For library projects, provide ONLY:
   - How to add the gem as a dependency
   - How to require it in code
   - NO detailed API usage unless explicitly documented

3. Example format for dependency inclusion:
   \`\`\`ruby
# In Gemfile
gem 'gem-name', '~> version'
   \`\`\`
   
   \`\`\`bash
# Direct installation
gem install gem-name
   \`\`\`

4. Example format for basic import:
   \`\`\`ruby
require 'gem-name'
   \`\`\`

5. Code block formatting requirements:
   - Always use proper markdown code blocks with language specifier (ruby, bash)
   - Place code on the line AFTER the opening backticks
   - Each statement should be on its own line with appropriate comments
   - Use consistent indentation throughout code examples
   - End code blocks with \`\`\` on its own line

6. Important:
   - Use the actual gem name from the gemspec or Gemfile
   - DO NOT guess or infer API usage without documented examples
   - If no integration instructions can be determined, return an empty array`;
}

// PHP 사용법 지시사항
function getPHPUsageInstructions(): string {
  return `
USAGE INSTRUCTIONS FOR PHP PROJECT:
When extracting usage information from composer.json files:

1. Determine if this is a library project by checking for:
   - Absence of "private": true
   - PSR-4 autoload configuration

2. For library projects, provide ONLY:
   - How to add the package as a dependency
   - How to include or autoload it in code
   - NO detailed API usage unless explicitly documented

3. Example format for dependency inclusion:
   \`\`\`bash
composer require vendor/package
   \`\`\`

4. Example format for basic import:
   \`\`\`php
<?php
// With Composer autoloader
require_once 'vendor/autoload.php';

// Direct class usage (if namespace is known)
use Vendor\\Package\\ClassName;
   \`\`\`

5. Code block formatting requirements:
   - Always use proper markdown code blocks with language specifier (php, bash)
   - Place code on the line AFTER the opening backticks
   - Each statement should be on its own line with appropriate comments
   - Use consistent indentation throughout code examples
   - End code blocks with \`\`\` on its own line

6. Important:
   - Use the actual package name from composer.json
   - Use namespace from autoload configuration if available
   - DO NOT guess or infer API usage without documented examples
   - If no integration instructions can be determined, return an empty array`;
}

// Dart/Flutter 사용법 지시사항
function getDartFlutterUsageInstructions(): string {
  return `
USAGE INSTRUCTIONS FOR DART/FLUTTER PROJECT:
When extracting usage information from pubspec.yaml files:

1. Determine if this is a library project by checking for:
   - Absence of "main" entry point specification
   - Library exports in lib directory

2. For library projects, provide ONLY:
   - How to add the package as a dependency
   - How to import it in code
   - NO detailed API usage unless explicitly documented

3. Example format for dependency inclusion:
   \`\`\`yaml
# In pubspec.yaml
dependencies:
  package_name: ^version
   \`\`\`
   
   \`\`\`bash
# Using Flutter CLI
flutter pub add package_name

# Using Dart CLI
dart pub add package_name
   \`\`\`

4. Example format for basic import:
   \`\`\`dart
import 'package:package_name/package_name.dart';
   \`\`\`

5. Code block formatting requirements:
   - Always use proper markdown code blocks with language specifier (yaml, dart, bash)
   - Place code on the line AFTER the opening backticks
   - Each statement should be on its own line with appropriate comments
   - Use consistent indentation throughout code examples
   - End code blocks with \`\`\` on its own line

6. Important:
   - Use the actual package name from pubspec.yaml
   - DO NOT guess or infer API usage without documented examples
   - If no integration instructions can be determined, return an empty array`;
}