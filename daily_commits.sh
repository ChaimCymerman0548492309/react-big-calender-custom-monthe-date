#!/bin/bash

# בדיקה אם git מותקן
if ! command -v git &> /dev/null
then
    echo "git could not be found. Please install Git and try again."
    exit 1
fi

# בדיקת יום (שישי/שבת)
DAY=$(date +%u)
if [ $DAY -eq 6 ] || [ $DAY -eq 7 ]; then
    echo "יום שישי/שבת, לא מבצע קומיטים."
    exit 0
fi

# מספר קומיטים אקראי (בין 1 ל-5)
NUM_COMMITS=$((RANDOM % 3 + 1))

# תיקיית הפרויקט
PROJECT_DIR="C:/Users/PC1/Desktop/chaim_cymerman/react-big-calendar-tutorial"

# בדיקה אם התיקייה קיימת
if [ ! -d "$PROJECT_DIR" ]; then
    echo "The project directory does not exist: $PROJECT_DIR. Please verify the path and try again."
    exit 1
fi

# מעבר לתיקיית הפרויקט
cd "$PROJECT_DIR"

# יצירת הקובץ test.txt אם הוא לא קיים
if [ ! -f "test.txt" ]; then
    touch test.txt
fi

# שינוי ייחודי ראשון כדי לוודא פעילות בגרף הפעילות
echo "Test commit for activity graph - $(date +%H:%M:%S)" >> test.txt
git add test.txt
git commit -m "Testing commit for activity graph - $(date +%H:%M:%S)"
git push origin main
if [ $? -ne 0 ]; then
    echo "Push failed for the initial commit. Exiting script."
    exit 1
fi

# לולאה ליצירת קומיטים נוספים עם תוכן ייחודי
for i in $(seq 1 $NUM_COMMITS); do
    echo "Commit $i content added on $(date)" >> test.txt
    git add test.txt
    COMMIT_MSG="Daily commit $i - $(date +%Y-%m-%d)"
    git commit -m "$COMMIT_MSG"
    git push origin main
    if [ $? -ne 0 ]; then
        echo "Push failed for commit: $COMMIT_MSG. Exiting script."
        exit 1
    fi
    echo "קומיט $i: $COMMIT_MSG"
done

# מחיקת הקובץ test.txt
rm test.txt

# ביצוע PULL מהריפו
# git fetch origin
# git reset --hard origin/main
# git pull origin main

echo "All commits, pushes, and pull completed successfully."
