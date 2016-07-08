#Perl Pascal: Ace Attorney
##Anthony Peloza
###06-03-2016  | Version 1.0

#Application Overview
PP:AA is a re-creation of the Phoenix Wright game engine (from the Nintendo DS) in Javascript. It is a game with a focus on story and defending your client in the role of a lawyer.  Players will progress through hearing testimony and then pressing witnesses or presenting evidence.

#Application Features
##Interchangeable Case Code
The cases draw from  JSON files to dictate things such as sprites used, lines on the screen, evidence, etc. This means that swapping out the JSON files can insert a whole new case into the game, though it is currently limited to using the pre-packaged sprites.

##Saving Progress
The user can click a save button to suspend their progress and return later where they left off. Up to three saves are allowed per case. This is accomplished by storing the user's data in a MongoDB database on MLab.




#Gameplay

At any time, users may click the evidence button to open up an evidence pane with the current evidence they have. Users can check their evidence, or present it (if the user is currently in a testimony).


During a testimony, users are presented with a handful of lines spoken from the witness (typically 4-6 lines) that they can go forwards or back through. The user is challenged to find the evidence they hold that contradicts the testimony. Users may have to press the witness on a specific line in order to get more information that will give hints towards what evidence to use.


At the end of the case, users are given a short scene congratulating them (as a player character), and the client. This is done using the normal text-flow of the game, and then at the end of this ‘epilogue’ type finisher, the user is returned to a main menu, listing cases the user can do.


#Technologies
Node, Express, jQuery, Heroku, MongoDB

