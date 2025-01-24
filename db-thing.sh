if [ -d "./drizzle" ]; then
  rm -r drizzle
  echo "Deleted existing drizzle directory."
fi

if [ -d "./server/db/drizzle" ]; then
  rm -r server/db/drizzle
  echo "Deleted existing server/db/drizzle directory."
else
  echo "No drizzle directory found, skipping deletion."
fi

drizzle-kit generate && drizzle-kit push