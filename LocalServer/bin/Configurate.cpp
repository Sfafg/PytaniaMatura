#include <fstream>
#include <iostream>
#include <string>
#include <vector>

int main(int argc, char *argv[])
{
    std::ifstream ifile(argv[1]);

    if (!ifile.is_open())
    {
        std::cout << argv[1] << " invalid directory.\n";
        std::cin.get();
        return -1;
    }

    std::vector<std::string> lines;

    while (true)
    {
        std::string line;
        std::getline(ifile, line);
        lines.push_back(line);

        if (ifile.eof())
            break;
    }
    ifile.close();

    std::ofstream ofile(argv[1], std::ios::trunc);
    if (!ofile.is_open())
    {
        std::cout << argv[1] << " invalid directory.\n";
        std::cin.get();
        return -1;
    }

    std::string DIRECTORY = argv[2];
    DIRECTORY.erase(DIRECTORY.end() - 1, DIRECTORY.end());

    ofile << "LoadModule php_module \""
          << DIRECTORY << "\\PHP\\php8apache2_4.dll\"\n"
          << "AddType application/x-httpd-php .php\n"
          << "PHPIniDir \"" << DIRECTORY << "\\PHP\"\n"
          << "LoadFile \"" << DIRECTORY << "\\PHP\\php8ts.dll\"\n"
          << "Define SRVROOT \"" << DIRECTORY << "\\Apache24\"\n";

    for (int i = 5; i < lines.size(); i++)
    {
        ofile << lines[i] << '\n';
    }

    ofile.close();

    return 0;
}