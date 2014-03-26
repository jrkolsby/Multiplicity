# Multiplicity
`Multiplicity` is a very simple yet powerful text-based calculator built in Javascript.

## Sales Pitch
From the developer of Periodic comes another tool built for students. Multiplicity mirrors the core functionality and usability of calculators like the TI84 or TINspire to which high-school students and teachers have become so accustomed. Being run from a browser has many benefits for doing online work like WebAssign, including the ability to copy and paste long decimals rather than typing them manually. The only real interface of this calculator is your keyboard, which allows long expressions to be input much more quickly and easily than with a calculator keypad. Perhaps the largest benefit of all, however, is that this calculator is absolutely free.

### [Repo hosted here](http://jmkl.co/multiplicity/)


## Development

Each day at around 10PM EST, a cron job launches a PHP script that connects Reddit API, logs links from all of the subreddits listed in a .txt file, and stores them on a MySQL table (Thanks, [setcronjob](http://setcronjob.com/)). One thing that was more or less new to me was an account making process. To be honest, I probably screwed this part up a bit, but I managed to figure out a very rudimentary way of going about it. On signup, all of the inputs are verified for characters and whatnot, the listed subreddits are verified to actually exist, and if everything checks out OK, the subreddits are added into a `subreddits.txt` file, and the username, encrypted password, and serialized subreddit list are all logged to a seperate table. On login, the username and password are verified against the `users` MySQL table, and if the login checks out a cookie is stored on the client's machine with his account's serialized subreddit array. When he logs in, PHP iterates through the `posts` table and prints posts from the selected date with subreddits in the cookie's subreddit array. Without doubt there's a more sophisticated way of doing this, but this setup works for the moment being (granted, there are only ~10 accounts thus far).
