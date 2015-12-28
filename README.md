Tim's Hot Sauce
===============

Hi there!  This little project is meant to serve two purposes.

1. To learn some Node.js, and create a fully functioning site, with an API ready for mobile consumption.
2. To help out my buddy, Tim.  He makes hot sauce.  It's cool.

The behavior of this site should basically serve the following purposes...

1. Tim (or one of his brood) can log in and create recipes for his hot sauces.  My guess is that a recipe consists of ingredients that have amounts, and steps for directions.  That should be about all.
2. Once Tim creates a recipe, he can create a batch.  This basically represents a real-life volume of that recipe that he made at some point in time.  A batch may take notes from Tim, and will have a set number of tester bottles for Tim to mail out.
3. Next, Tim can add testers.  Testers will have mailing addresses and names, and will be mailed testers bottles.  Tim may mail a few different tester bottles to each tester.
4. Once the testers receive (and taste) their bottle, they can come back to the site and leave some feedback based on some unique ID that the bottle has.
5. After all the feedback is collected, Tim would like to see it aggregated by recipes and batches.

In order to pull this off, let's break down the whole thing.

- [Pages](#pages)
  - [Welcome](#welcome)
  - [Tester](#tester)
  - [Admin](#admin)
- [Model](#model)
  - [User](#user)
  - [Recipe](#recipe)
  - [Batch](#batch)
  - [Bottle](#bottle)
  - [Tester](#tester)
  - [Feedback](#feedback)
- [API](#api)
  - [/user](#user-1)
  - [/recipe](#recipe-1)
  - [/batch](#batch-1)
  - [/bottle](#bottle-1)
  - [/tester](#tester-1)
  - [/feedback](#feedback-1)

Pages
=====

Welcome
-------

This should be a simple welcome page that says Welcome to Tim's, we're working on being awesome, blah blah.  It should have a highly visible link for testers to submit feedback.

Tester
------

This should be the general flow that a tester walks through when they come to give some feedback on some delicious hot sauce.

### Bottle Entry

The first thing we need to do is submit a bottle, so the first screen should simply be a textfield to take the ID of the bottle.  This screen should be cryptic and cool looking.

#### Collect Feedback

Once we know the bottle, let's look up the tester, and feel more welcoming.  "Hey Herm!  Thanks for the feedback!" kinda' thing.  Next we'll set up a form to collect some standardized feedback.

### Thanks

Some real huggy-feely thanks page where Tim bares his soul to the feedbacker.

Admin
-----

This is Tim's playground.  Something he can use to play around with this whole thing!

### Overview

The overview should list out all Admins, Recipes and Testers in a standard ladder style kinda' format where you can add and remove from that list.  I'm imagining adding will be a modal popover form, but it may be easier to move to another screen so we don't go too crazy with it.

### Recipe Detail

When you click on a recipe, you should drill down to its detail.  This should include all ingredients and cooking steps.  From this screen, Tim should also be able to see all batches, create all batches, add testers to batches, and (maybe) print labels for the batch.  Feedback should also be visible on this screen.

Model
=====

User
----

These should really only be the Admin users...like Tim. Nothing crazy about 'em, just need to log in.

1. Nickname (alpha only, required)
2. Email    (email format, required)
3. Password (> 4 chars, required)

Recipe
------

This represents all information about the recipes Tim will be making, and tracking the batches he makes, as he sends sauce out to testers!

1. Name (required, alpha and whitespace only)
2. Created Date (required, unix time)
2. Ingredients (Must have at least one. Each ingredient must have an ingredient, quantity, and unit).
3. Directions (not required, basically just free entry.  Don't allow any whitespace things here).
4. Batches

Batch
-----

This represents one batch of a recipe.  These will be sent out to testers.

For some clarity, the recipe name and, with the created date of the batch, give the batch a unique ID.  The recipe created date allows us to look up the recipe from the batch.

1. Recipe name (required)
1. Created Date (required)
2. Recipe created_date (required)
2. Notes (not required, free entry, just don't allow empty garbage)
3. Bottles (not initially required, these can be added later)

Bottle
------

This is a single bottle, which will go to a single tester and ideally will get feedback.

1. Batch (required)
2. Hash  (unique ID we generate, required)
3. Tester (Not required, because bottles can be "waiting" for testers.  But it should be populated at some point.
4. Feedback (Same validation as Tester)

Tester
------

The people who will be doing the testing.  They may get several bottles to test.

1. Nickname (required, alpha and whitespace only, should be casual...what Tim would actually call this person).
2. Email address (required, email format)
3. Mailing Address (Just take this as-is and hope Tim doesn't fuck it up).
4. Bottles

Feedback
--------

This is the information that a tester leaves about a bottle.

1. Bottle (required)
2. Flavor (required, 1-10)
3. Heat (required, 1-10)
4. Consistency (required, 1-10)
5. Color (required, 1-10)
6. Smell (required, 1-10)
7. Too salty? (required, binary)
8. Too sweet? (required, binary)
9. Would you purchase this? (required, binary)
10. Would you purchase this a second time? (required, binary)
11. Would you recommend to a friend? (required, binary)
12. Would you ask for this at a restaurant? (required, binary)
13. Additional Feedback. (not required.  Sanitize for non-empty)

API
===

/user
-----

All operations to a single or all users, create a user, and delete a user.

### GET /

Lists all users

### POST /

Create a user

### GET /:email

Gets a user by email

### DELETE /:email

Deletes a user by email

/recipe
-------

### POST /

Creates a new recipe

### GET /

Retrieves all recipes

### GET /:name

Retrieves a single recipe by name

### DELETE /:name

Deletes a single recipe by name

/batch
------

### POST /

Creates a batch and attaches it to a recipe

### DELETE /:id

Deletes a batch by id

/bottle
-------

### POST /

Creates a bottle, and attaches it to a batch.

### DELETE /:hash

Deletes a bottle

### PUT /:hash/:tester_nickname

Attaches a tester to a bottle

### PUT /:hash/feedback

Adds feedback to the bottle.

/tester
-------

### POST /

Creates a tester

### PUT /

Updates the tester

### GET /

Gets all testers

### GET /:nickname

Gets a single tester

### DELETE /:nickname

Deletes a tester

