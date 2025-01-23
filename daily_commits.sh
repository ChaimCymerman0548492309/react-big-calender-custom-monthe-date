#!/bin/bash

if ! command -v git &> /dev/null
then
    echo "git could not be found. Please install Git and try again."
    exit
fi

DAY=$(date +%u)

if [ $DAY -eq 6 ] || [ $DAY -eq 7 ]; then
    echo "יום שישי/שבת, לא מבצע קומיטים."
    exit
fi

NUM_COMMITS=$((RANDOM % 5 + 1))

cd C:/Users/PC1/Desktop/chaim_cymerman/react-big-calendar-tutorial

echo "Test commit for activity graph"$(NUM_COMMITS) >> test.txt
git add test.txt
git commit -m "Testing commit for activity graph"
git push origin main

for i in $(seq 1 $NUM_COMMITS); do
    COMMIT_MSG="Daily commit $i - $(date +%Y-%m-%d)"
    git add .
    git commit -m "$COMMIT_MSG"
    git push origin main
    echo "קומיט $i: $COMMIT_MSG"
done
