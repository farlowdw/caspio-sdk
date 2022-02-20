#!/usr/bin/env

shopt -s extglob
rm -rf !(jsdocs-reset.sh|package.json|package-lock.json|jsdoc.json|caspio-sdk-jsdocs.md|node_modules|tutorials)

gawk -i inplace -v beg='Documentation for immediate reference may be found below.' -v end='## License' 'NR==FNR{new = new $0 ORS; next} $0~end{f=0} !f{print} $0~beg{printf "%s",new; f=1}' caspio-sdk-jsdocs.md ../README.md