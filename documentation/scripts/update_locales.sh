#!/bin/bash

# Set the directory where your translation files are located
TRANSLATION_DIR="../client/app/assets/data_src/pot/"

# Define the list of languages and corresponding .po files to merge
LANGUAGES=("it" "en" "fr" "es" "de" "ru" "ar" "zh_CN")

# Path to the gettext .pot template file generated by Sphinx
POT_FILE="_build/gettext/sphinx.pot"

# Check if the .pot file exists, if not generate it
if [ ! -f "$POT_FILE" ]; then
  echo "Generating .pot file with Sphinx"
  sphinx-build -b gettext . _build/gettext
fi

# Initialize translations for each language if not already initialized
for LANG in "${LANGUAGES[@]}"; do
  echo "Initializing translations for language: $LANG"

  # Initialize language directory with sphinx-intl
  sphinx-intl update -p _build/gettext -l $LANG
  find locale/$LANG/LC_MESSAGES/ -mindepth 1 ! -name 'sphinx.po' ! -name 'sphinx.mo' -delete
done

# Compile .po files into .mo files for Sphinx to use
sphinx-intl build
