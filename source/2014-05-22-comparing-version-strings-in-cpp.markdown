---
title: Comparing Version Strings in C++
date: 2014-05-22
tags: code, cpp
author: Kam Low
author_site: https://plus.google.com/+KamLow
layout: article
---

# Comparing Version Strings in C++

If you're building any kind of version management system in C++, such as a package manager or plugin system, then you'll need to be able to maniulate, compare and print version strings. The `Version` structure below is extracted from [pacm](/pacm), and does exactly that:

~~~ cpp	
#include <cstdio>
#include <string>
#include <iostream>

struct Version
{
	int major, minor, revision, build;

	Version(const std::string& version)
	{
		std::sscanf(version.c_str(), "%d.%d.%d.%d", &major, &minor, &revision, &build);
		if (major < 0) major = 0;
		if (minor < 0) minor = 0;
		if (revision < 0) revision = 0;
		if (build < 0) build = 0;
	}

	bool operator < (const Version& other)
	{
		if (major < other.major)
			return true;
		if (minor < other.minor)
			return true;
		if (revision < other.revision)
			return true;
		if (build < other.build)
			return true;
		return false;
	}

	bool operator == (const Version& other)
	{
		return major == other.major 
			&& minor == other.minor 
			&& revision == other.revision 
			&& build == other.build;
	}

	friend std::ostream& operator << (std::ostream& stream, const Version& ver) 
	{
		stream << ver.major;
		stream << '.';
		stream << ver.minor;
		stream << '.';
		stream << ver.revision;
		stream << '.';
		stream << ver.build;
		return stream;
	}
};
~~~

Example usage:

~~~ cpp
void testVersionStringComparison() 
{
	assert((Version("3.7.8.0") == Version("3.7.8.0")) == true);
	assert((Version("3.7.8.0") == Version("3.7.8")) == true);
	assert((Version("3.7.8.0") < Version("3.7.8")) == false);
	assert((Version("3.7.9") < Version("3.7.8")) == false);
	assert((Version("3") < Version("3.7.9")) == true);
	assert((Version("1.7.9") < Version("3.1")) == true);
	
	std::cout << "Printing version (3.7.8.0): " << Version("3.7.8.0") << endl;
}
~~~