#! /bin/sh
echo "##################################"
echo "Files in directory:"
echo
ls
search=true
echo

while $search
do
    echo "##################################"
    echo "Want to move from this directory? (yes/no)"
    read -r
    choiche=$REPLY
    if [ $choiche = "yes" ]
    then
        echo "##################################"
        echo "Write destination directory"
        read -r
        destination=$REPLY
        cd $destination
        echo "##################################"
        echo "Files in directory:"
        echo
        ls
    fi
    if [ $choiche = "no" ];
    then
        echo "##################################"
        echo "Choose file"
        read -r
        fileToEdit=$REPLY
        if test -f $fileToEdit; 
        then
            echo "##################################"
            echo "Want to edit or delete? (edit/delete)"
            read -r
            action=$REPLY
            if [ $action = "edit" ] 
            then
                vi $fileToEdit
                search=false
            fi
            if [ $action = "delete" ] 
            then
                rm $fileToEdit
                search=false
            else
                echo "Command not valid, restart."
            fi
        else
            echo "File not exists"
            echo "##################################"
            ls
            echo "##################################"
        fi
    fi
done