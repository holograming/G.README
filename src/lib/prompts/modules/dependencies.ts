// src/lib/prompts/modules/dependencies.ts 확장

// 의존성 분석 관련 프롬프트 모듈
export function getBasicDependenciesPrompt(): string {
  return `4. Dependencies and Installation:
   - For each dependency found, ALWAYS extract both name AND version
   - If version is not explicitly specified, use "latest" as the version
   - For dependencies with variable references, try to resolve the actual version value
   - Dependencies must always be returned in the format: { "name": "dependency-name", "version": "specific-version" }
   `;
}

/**
 * 파일 유형에 따른 구체적인 분석 지시사항 생성
 */
export function getFileSpecificInstructions(fileName: string): string {
  const lowercaseName = fileName.toLowerCase();
  
  // 파일 확장자별 특화 프롬프트 반환
  if (lowercaseName === 'cmakelists.txt' || lowercaseName.endsWith('.cmake')) {
    return getCMakeInstructions();
  } else if (lowercaseName === 'package.json') {
    return getNpmInstructions();
  } else if (lowercaseName.endsWith('.gradle') || lowercaseName.endsWith('.gradle.kts')) {
    return getGradleInstructions();
  } else if (lowercaseName === 'pom.xml') {
    return getMavenInstructions();
  } else if (lowercaseName === 'requirements.txt' || lowercaseName === 'setup.py') {
    return getPythonInstructions();
  } else if (lowercaseName === 'cargo.toml') {
    return getRustInstructions();
  } else if (lowercaseName === 'go.mod') {
    return getGoInstructions();
  } else if (lowercaseName === 'gemfile') {
    return getRubyInstructions();
  } else if (lowercaseName === 'composer.json') {
    return getPHPInstructions();
  } else if (lowercaseName === 'pubspec.yaml' || lowercaseName === 'pubspec.yml') {
    return getDartFlutterInstructions();
  } else if (lowercaseName === 'project.clj') {
    return getClojureInstructions();
  } else if (lowercaseName === 'sbt.build' || lowercaseName.endsWith('.sbt')) {
    return getScalaInstructions();
  } else if (lowercaseName === 'dockerfile') {
    return getDockerfileInstructions();
  }
  
  // 기본값 (특정 지시사항 없음)
  return getGenericInstructions();
}

// 일반적인 의존성 분석 지시사항 (모든 파일 유형에 적용)
function getGenericInstructions(): string {
  return `
GENERAL INSTRUCTIONS FOR ALL FILE TYPES:
When no specific file type is detected, follow these rules for dependency extraction:

1. Dependencies Detection:
   - Look for any import statements, require() calls, or library references
   - Extract library/package names and their versions if specified
   - Always include both name and version in the output
   - If version is not specified, use "latest" as the version
   - Format each dependency as: {"name": "dependency-name", "version": "version-string"}

2. Version Pattern Recognition:
   - Look for version strings in formats like: X.Y.Z, vX.Y.Z, X.Y
   - Version might appear after symbols like @, =, >=, ~, ^ 
   - For semantic versioning with range specifiers, use the minimum allowed version`;
}

// CMake 프로젝트 분석 지시사항 개선
function getCMakeInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR CMAKE PROJECT:
When analyzing this CMake file, follow these specific rules for dependencies:

1. Dependencies in CMake:
   - Extract from find_package() calls which have the following typical forms:
     - find_package(<PackageName> [<version>] [REQUIRED] [COMPONENTS <components>...])
     - find_package(<PackageName> <version> [EXACT] [QUIET] [MODULE] [REQUIRED] [[COMPONENTS] [components...]])
     - find_package(NAMES <pkg1> <pkg2> ... [REQUIRED] [COMPONENTS <components>...])
     
     The package name is the first argument (e.g., Boost)
     Version is typically the second argument, when specified (e.g., find_package(Boost 1.71.0))
     Version may also be specified with VERSION keyword (e.g., find_package(Boost VERSION 1.71.0))
     
   - For find_package with NAMES option (e.g., find_package(NAMES Qt6 Qt5 REQUIRED COMPONENTS Widgets)):
     - This syntax allows searching for multiple package names in order of preference
     - Extract the package family/base name (without version numbers) as the dependency name
     - Create a suitable version range based on the package versions listed in NAMES
     - For example: NAMES Qt6 Qt5 -> base name "Qt" with appropriate version indication
     - This approach should work for any module with multiple version options
     
   - Extract from FetchContent_Declare() calls
     The project name is the first argument
     Version comes from GIT_TAG if specified
   - Extract from ExternalProject_Add() calls
     The project name is the first argument
     Version comes from URL or GIT_TAG if specified
   - Extract from target_link_libraries() calls to identify dependencies
     If the target uses namespaced syntax (::), extract the library name before the ::

2. Version extraction:
   - For find_package with direct version as second argument (e.g., find_package(Boost 1.71.0)), use that version
   - For find_package with VERSION keyword (e.g., find_package(Boost VERSION 1.71.0)), extract that version
   - For find_package with NAMES, derive a version range format that represents all listed versions
   - For GIT_TAG with version tags: extract version from tag (e.g., "v1.2.3" → "1.2.3")
   - For GIT_TAG with commit hashes: use first 7 characters of hash as version
   - For version ranges (e.g., find_package(Boost 1.65...1.72)), use the minimum version
   - If no version is found, use "latest" as the version value
   - Always include both name and version for each dependency`;
}

// NPM/Node.js 프로젝트 분석 지시사항
function getNpmInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR NPM PROJECT:
When analyzing this package.json file, follow these specific rules for dependencies:

1. Dependencies in package.json:
   - Extract all entries from "dependencies" object as dependencies
     Name: the key in the dependencies object
     Version: the version string value (e.g., "^1.2.3", "~2.0.0", "latest")
     Keep version ranges as-is, do not simplify them (e.g., keep "^1.2.3" instead of converting to "1.2.3")
   - Extract entries from "devDependencies" as development dependencies
     Include in dependencies array with the exact same format
   - Look for "peerDependencies" and include them too
   - For private GitHub or GitLab repositories as dependencies:
     Extract the repository name as the dependency name
     Extract the commit hash or tag as the version if specified

2. Version extraction:
   - Preserve the exact version string from package.json including any prefixes (^, ~, >=, etc.)
   - For repository URLs, extract the version from the URL fragment (#) if available
   - For git+https protocol URLs, extract the version from the URL fragment
   - Always include both name and version for each dependency`;
}

// Gradle 프로젝트 분석 지시사항
function getGradleInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR GRADLE PROJECT:
When analyzing this Gradle file, follow these specific rules for dependencies:

1. Dependencies in Gradle:
   - Extract from implementation(), api(), compile(), testImplementation() etc. function calls
   - Maven coordinates usually follow format: group:name:version
   - Extract each part: 
     Name: the middle part of the coordinate (e.g., 'retrofit2' from 'com.squareup.retrofit2:retrofit:2.9.0')
     Version: the last part of the coordinate (e.g., '2.9.0' from 'com.squareup.retrofit2:retrofit:2.9.0')
   - For Kotlin DSL (build.gradle.kts), look for dependencies {} blocks
   - Also check buildscript dependencies

2. Version extraction:
   - For inline versions in coordinates (group:name:version), extract the version part
   - For version variables, look for:
     - ext.versionName = "1.2.3" declarations
     - project property references like "\${project.version}" or "\${version}"
     - buildSrc version declarations
     - version catalogs references
   - For version catalogs, look for libs.versions.toml files
   - If using a + in the version (e.g., 1.2.+), use that as the version
   - Always include both name and version for each dependency
   - If a version is a property reference that can't be resolved, use "variable-reference" as the version`;
}

// Maven 프로젝트 분석 지시사항
function getMavenInstructions(): string {
  // 템플릿 리터럴 내에서 ${}가 해석되지 않도록 여러 부분으로 나누어 작성
  return `
SPECIFIC INSTRUCTIONS FOR MAVEN PROJECT:
When analyzing this Maven POM file, follow these specific rules for dependencies:

1. Dependencies in Maven:
   - Extract from <dependencies> section
   - For each <dependency> element, extract:
     Name: value of <artifactId> element
     Version: value of <version> element
   - Look for version properties in <properties> section if version uses property reference syntax like \${property.name}
   - Check for <dependencyManagement> section as well
   - Note the scope if specified (compile, provided, runtime, test, etc.)

2. Version extraction:
   - For explicit versions in <version> tags, use that value directly
   - For property references like \${version.library}:
     - Look for matching property in <properties> section
     - If found, use the property value as the version
     - If not found, use "property-reference" as the version
   - For parent POM version inheritance, look for <parent> section
   - Always include both name and version for each dependency
   - If a version is completely missing, use "managed-version" as the version`;
}

// Python 프로젝트 분석 지시사항
function getPythonInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR PYTHON PROJECT:
When analyzing this Python project file, follow these specific rules for dependencies:

1. Dependencies in Python:
   - For requirements.txt:
     Each line typically represents a package
     Extract package name (before any comparison operators)
     Extract version requirements (after comparison operators like ==, >=, <=)
   - For setup.py:
     Extract from install_requires list
     Extract from extras_require dictionary
     Format is same as requirements.txt

2. Version extraction:
   - For requirements with exact version pin (==): use the exact version
   - For requirements with minimum version (>=): use that as the version
   - For requirements with compatible release (^= or ~=): use the base version
   - For requirements with multiple constraints: use the most restrictive version
   - For requirements without version specifiers: use "latest" as the version
   - Always include both name and version for each dependency
   - Examples of version extraction:
     - "requests==2.28.1" → name: "requests", version: "2.28.1"
     - "flask>=2.0.0" → name: "flask", version: "2.0.0"
     - "django" → name: "django", version: "latest" `;
}

// Rust (Cargo) 프로젝트 분석 지시사항
function getRustInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR RUST PROJECT:
When analyzing this Cargo.toml file, follow these specific rules for dependencies:

1. Dependencies in Rust:
   - Extract from [dependencies] section where dependencies are listed as:
     - Simple version: package_name = "version"
     - Complex with features: package_name = { version = "version", features = ["feature1", "feature2"] }
   - Also check [dev-dependencies], [build-dependencies], and [target.'cfg(...)'.dependencies] sections
   - For workspace members, check the [workspace.dependencies] section as well

2. Version extraction:
   - For simple version strings: use the exact version string including any operators (e.g., "^1.2.3", "~2.0")
   - For complex dependency specifications, extract the version from the "version" field
   - For git dependencies with branch/tag/rev: extract the branch, tag, or rev value
     - For tags that look like versions (e.g., "v1.2.3"), extract "1.2.3" as the version
     - For branches or revisions, use that as the version
   - For path dependencies: use "local" as the version
   - Always include both name and version for each dependency`;
}

// Go 프로젝트 분석 지시사항
function getGoInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR GO PROJECT:
When analyzing this go.mod file, follow these specific rules for dependencies:

1. Dependencies in Go:
   - Extract from "require" statements or blocks where dependencies are listed as:
     - require github.com/package/name v1.2.3
     - require (
         github.com/package1/name v1.0.0
         github.com/package2/name v2.0.0
       )
   - Extract the full module path as the name (e.g., "github.com/package/name")
   - Check "replace" directives to see if any dependencies are replaced

2. Version extraction:
   - Go modules use semantic versioning prefixed with 'v' (e.g., v1.2.3)
   - Extract the version part without the 'v' prefix (e.g., "1.2.3")
   - For pseudo-versions (e.g., v0.0.0-20200823014737-9f7001d12a5f), extract as is without 'v'
   - For indirect dependencies marked with // indirect comment, still extract name and version
   - Always include both name and version for each dependency`;
}

// Ruby (Gemfile) 프로젝트 분석 지시사항
function getRubyInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR RUBY PROJECT:
When analyzing this Gemfile, follow these specific rules for dependencies:

1. Dependencies in Ruby:
   - Extract from "gem" statements where gems are listed as:
     - Simple version: gem 'name', 'version'
     - Version constraints: gem 'name', '>= 1.0', '< 2.0'
     - Complex options: gem 'name', version: '1.0', require: false
   - Extract from "gemspec" statement if present
   - Check for groups (development, test, production)

2. Version extraction:
   - For simple version strings: use the exact version string
   - For version constraints like '>= 1.0', use the version part (e.g., "1.0")
   - For multiple constraints, use the most restrictive version
   - For gems without version: use "latest"
   - For git sources with branch/tag/ref: extract that as the version
   - For path sources: use "local" as the version
   - Always include both name and version for each dependency`;
}

// PHP (Composer) 프로젝트 분석 지시사항
function getPHPInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR PHP PROJECT:
When analyzing this composer.json file, follow these specific rules for dependencies:

1. Dependencies in PHP:
   - Extract from "require" object where dependencies are listed as:
     - "package/name": "version constraint"
   - Also check "require-dev" for development dependencies
   - Extract vendor/package as the name (e.g., "vendor/package")

2. Version extraction:
   - Composer uses version constraints with operators (e.g., "^1.2.3", ">=2.0 <3.0")
   - For simple constraints: use the version part (e.g., "1.2.3" from "^1.2.3")
   - For range constraints: use the lower bound (e.g., "2.0" from ">=2.0 <3.0")
   - For dev-master or dev-branch: use "dev" as the version
   - For stability flags (e.g., "1.0@beta"): include the stability flag
   - Always include both name and version for each dependency`;
}

// Dart/Flutter 프로젝트 분석 지시사항
function getDartFlutterInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR DART/FLUTTER PROJECT:
When analyzing this pubspec.yaml file, follow these specific rules for dependencies:

1. Dependencies in Dart/Flutter:
   - Extract from "dependencies:" section where dependencies are listed as:
     - Simple version: package_name: version
     - Hosted package: package_name: ^1.2.3
     - Git source: package_name: {git: {url: 'url', ref: 'branch'}}
   - Also check "dev_dependencies:" for development dependencies
   - Extract the package name as the name

2. Version extraction:
   - For simple version strings: use the exact version string
   - For constraints with caret (^): use the version without caret (e.g., "1.2.3" from "^1.2.3")
   - For constraints with other operators: use the version part
   - For git packages: use branch/tag/commit as version
   - For path packages: use "local" as the version
   - For SDK packages: use the SDK constraint as the version
   - Always include both name and version for each dependency`;
}

// Clojure (Leiningen) 프로젝트 분석 지시사항
function getClojureInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR CLOJURE PROJECT:
When analyzing this project.clj file, follow these specific rules for dependencies:

1. Dependencies in Clojure:
   - Extract from :dependencies vector where dependencies are listed as:
     - [org.package/name "version"]
   - Also check :dev-dependencies or :profiles/:dev/:dependencies
   - Extract the org.package/name as the name

2. Version extraction:
   - Leiningen uses simple version strings (e.g., "1.2.3")
   - Extract the exact version string
   - For SNAPSHOT versions: keep the SNAPSHOT suffix
   - For version ranges: use the lower bound
   - Always include both name and version for each dependency`;
}

// Scala (SBT) 프로젝트 분석 지시사항
function getScalaInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR SCALA PROJECT:
When analyzing this SBT build file, follow these specific rules for dependencies:

1. Dependencies in Scala:
   - Extract from "libraryDependencies" setting where dependencies are listed as:
     - "org.package" %% "name" % "version"
     - "org.package" % "name" % "version"
   - Check for different configuration scopes (e.g., Test, Provided)
   - Extract the org.package and name as the combined name

2. Version extraction:
   - SBT uses simple version strings (e.g., "1.2.3")
   - For version variables: look for val statements defining the version
   - For cross-building with %%: note that SBT appends the Scala version
   - For version ranges: use the lower bound
   - Always include both name and version for each dependency`;
}

// Dockerfile 분석 지시사항
function getDockerfileInstructions(): string {
  return `
SPECIFIC INSTRUCTIONS FOR DOCKERFILE:
When analyzing this Dockerfile, follow these specific rules for dependencies:

1. Dependencies in Dockerfile:
   - Extract base images from FROM statements (e.g., FROM node:14-alpine)
     Use the base image name as the dependency name (e.g., "node")
     Use the tag as the version (e.g., "14-alpine")
   - Extract packages installed via package managers like:
     - apt-get install package1 package2
     - apk add package1 package2
     - npm install package1 package2
     - pip install package1 package2
   - For multi-stage builds, extract dependencies from each stage

2. Version extraction:
   - For base images: extract the tag part (e.g., "14-alpine" from "node:14-alpine")
   - If no tag is specified (e.g., FROM ubuntu), use "latest" as the version
   - For specific package versions in install commands:
     - apt-get: package=version
     - apk: package=version
     - npm: package@version
     - pip: package==version
   - If no specific version is provided for a package, use "latest"
   - Always include both name and version for each dependency`;
}