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
    echo "יום שישי/שבת, לא מבצע פעולות."
    exit 0
fi

# תיקיית הפרויקט
PROJECT_DIR="C:/Users/PC1/Desktop/chaim_cymerman/react-big-calendar-tutorial"

# בדיקה אם התיקייה קיימת
if [ ! -d "$PROJECT_DIR" ]; then
    echo "The project directory does not exist: $PROJECT_DIR. Please verify the path and try again."
    exit 1
fi

# מעבר לתיקיית הפרויקט
cd "$PROJECT_DIR"

# יצירת קובץ test.txt אם אינו קיים
if [ ! -f "test.txt" ]; then
    touch test.txt
fi

# פעולות אקראיות על מנת ליצור היסטוריית פעילות מגוונת
function perform_random_actions() {
    ACTION=$((RANDOM % 4 + 1))
    case $ACTION in
        1)
            echo "Adding a new file to the repo..."
            NEW_FILE="new_file_$(date +%H%M%S).txt"
            echo "This is a new file created on $(date)" > "$NEW_FILE"
            git add "$NEW_FILE"
            git commit -m "Added $NEW_FILE to the repository"
            ;;
        2)
            echo "Modifying an existing file..."
            echo "Modification made on $(date)" >> test.txt
            git add test.txt
            git commit -m "Modified test.txt on $(date)"
            ;;
        3)
            echo "Renaming a file..."
            if [ -f "test.txt" ]; then
                mv test.txt renamed_test_$(date +%H%M%S).txt
                git add .
                git commit -m "Renamed test.txt to renamed_test_$(date +%H%M%S).txt"
            else
                echo "File test.txt does not exist, skipping rename action."
            fi
            ;;
        4)
            echo "Deleting a file..."
            if [ -f "test.txt" ]; then
                rm test.txt
                git add .
                git commit -m "Deleted test.txt from the repository"
            else
                echo "File test.txt does not exist, skipping delete action."
            fi
            ;;
        *)
            echo "No valid action was selected."
            ;;
    esac
}

# פעולות מגוונות (מספר פעולות אקראיות)
NUM_ACTIONS=$((RANDOM % 3 + 2)) # מספר פעולות בין 2 ל-4
for i in $(seq 1 $NUM_ACTIONS); do
    perform_random_actions
    git push origin main
done

echo "All actions completed successfully."
