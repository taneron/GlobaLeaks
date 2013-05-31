#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCRIPTNAME="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
GLBACKEND_GIT_REPO="https://github.com/globaleaks/GLBackend.git"
GLOBALEAKS_DIR=/data/globaleaks
OUTPUT_DIR=$GLOBALEAKS_DIR/GLBackend/glbackend_build

set -e

usage()
{
cat << EOF
usage: ./${SCRIPTNAME} options

OPTIONS:
   -h      Show this message
   -v      To build a tagged release"
   -n      To build a non signed package"
   -y      To assume yes to all queries"

EOF
}

SIGN=1
ASSUME_YES=0
while getopts “hv:ny” OPTION
do
  case $OPTION in
    h)
      usage
      exit 1
      ;;
    v)
      TAG=$OPTARG
      ;;
    n)
      SIGN=0
      ;;
    y)
      ASSUME_YES=1
      ;;
    ?)
      usage
      exit
      ;;
    esac
done

mkdir -p $GLOBALEAKS_DIR $OUTPUT_DIR

build_glbackend()
{
  touch a/a/a/a
  if [ -d ${GLOBALEAKS_DIR}/GLBackend ]; then
    echo "Directory ${GLOBALEAKS_DIR}/GLBackend already present"
    echo "The build process needs a clean git clone of GLBackend"
    if [ ${ASSUME_YES} -eq 0 ]; then
      read -n1 -p "Are you sure you want delete ${GLOBALEAKS_DIR}/GLBackend? (y/n): "
      echo
      if [[ $REPLY != [yY] ]]; then
        echo "Exiting ..."
        exit
      fi
    fi
    echo "Removing directory ${GLOBALEAKS_DIR}"
    rm -rf ${GLOBALEAKS_DIR}/GLBackend
  fi

  echo "[+] Cloning GLBackend in ${GLOBALEAKS_DIR}"
  git clone $GLBACKEND_GIT_REPO ${GLOBALEAKS_DIR}/GLBackend

  GLBACKEND_REVISION=`git rev-parse HEAD | cut -c 1-8`

  if test $GLBACKEND_TAG; then
    git checkout $GLBACKEND_TAG
    $GLBACKEND_REVISION=$GLBACKEND_TAG
  fi

  echo "[+] Building GLBackend"
  cd ${GLOBALEAKS_DIR}/GLBackend
  POSTINST=${GLOBALEAKS_DIR}/GLBackend/debian/postinst
  echo "/etc/init.d/globaleaks start" >> $POSTINST
  echo "# generated by your friendly globaleaks build bot :)" >> $POSTINST
  python setup.py sdist
  echo "[+] Building .deb"

  cd dist
  py2dsc globaleaks-*.tar.gz
  cd deb_dist/globaleaks-*
  rm -rf debian/
  cp -rf ${GLOBALEAKS_DIR}/GLBackend/debian debian

  if [ $SIGN -eq 1 ]; then
    debuild
  else
    debuild -i -us -uc -b
  fi

  mkdir -p ${OUTPUT_DIR}
  mv /data/globaleaks/GLBackend/dist/* ${OUTPUT_DIR}
}

build_glbackend

echo "[+] All done!"

