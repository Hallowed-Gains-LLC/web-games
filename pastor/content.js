// A Pastor’s Year at St. Luke’s: all words in the game.
// Plain data only. See SPEC.md for the shape. Scripture is KJV, checked word for word.
window.PASTOR = {

  // ───────────────────────── 1. Generic actions ─────────────────────────
  pools: {
    // Wednesday confirmation class, on weeks when Josh has no story waiting.
    catechism: [
      { text: "The Ten Commandments, with the explanations. Josh asks if “thou shalt not kill” covers video games. A long, surprisingly good discussion follows." },
      { text: "Memory work: the Apostles’ Creed. Seven of eight kids get it word for word. The eighth gets it word for word, in a pirate voice." },
      { text: "“What does this mean?” you ask, and four voices answer, almost together. Luther would be pleased. You are." },
      { text: "The Lord’s Prayer, petition by petition. “Daily bread” turns into twenty minutes on what counts as bread. Pizza is ruled bread." },
      { text: "Baptism. You show them the font and the date of each of their baptisms in the old register. They go quiet, reading their own names." },
      { text: "Sermon notes are due. One reads, in full: “Pastor talked about sheep. Jesus is the good one.” Honestly, that’s most of it." },
      { text: "“Thy word is a lamp unto my feet, and a light unto my path” (Psalm 119:105). Josh points out that it’s also, technically, a flashlight." },
      { text: "The Office of the Keys. A girl asks if you can really forgive sins. “Not my own power,” you say. “Christ’s word, in my mouth.” She writes that down." },
      { text: "Confession: the class practices the questions from the catechism, and nobody laughs, and then everybody laughs, and that’s all right." },
      { text: "“And that from a child thou hast known the holy scriptures” (2 Timothy 3:15). Class ends with the Small Catechism’s evening prayer, read together." }
    ],
    // Monthly Communion calls on the homebound and at Pine Haven.
    communion: [
      { text: "The portable Communion set, the little book, a full afternoon. Six homes, six kitchen tables, the same Supper. “This is my body which is given for you” (Luke 22:19)." },
      { text: "At Pine Haven you set a corporal on a hospital tray. Four St. Luke’s members gather in wheelchairs. Mrs. Dahl sings every word of the liturgy, loudly." },
      { text: "Mr. Krause can’t remember your name, but when you begin the Lord’s Prayer he says every word with you, and he receives the Sacrament with folded hands." },
      { text: "“For as often as ye eat this bread, and drink this cup, ye do shew the Lord’s death till he come” (1 Corinthians 11:26). You say it to a farmer who can no longer farm." },
      { text: "A shut-in confesses, you absolve her in Christ’s stead, and she receives His body and blood at her own table. “Now I can sleep,” she says." },
      { text: "Arne’s mother has her best tablecloth out for you, the one from her wedding. The Lord’s Supper on 1951 linen. She says it was saved for something important." }
    ],
    study: [
      { text: "You read {gospel} three times. On the third, one word catches like a burr on a sock. That’s Sunday’s sermon, if you’re patient with it.", fx: { sermon: 2 } },
      { text: "Greek lexicon, cold coffee and {gospel}. You find a verb you’d missed for fifteen years, underline it twice and say “huh” out loud to nobody." },
      { text: "Biscuit sleeps on your commentary, open to exactly the page you need. You read around the cat.", fx: { sermon: -2, strength: 2 } },
      { text: "You write a brilliant opening line. Then a second one that cancels it. Then you delete both and start with the text, which is usually the right idea." },
      { text: "You read {gospel} aloud to the empty office. It sounds different out loud. “So then faith cometh by hearing, and hearing by the word of God” (Romans 10:17).", fx: { sermon: 2 } },
      { text: "You try out an illustration about your car’s check-engine light. It is a good illustration. It is not about Jesus. You cut it." },
      { text: "The phone rings four times while you study {gospel}. Three are wrong numbers for the Willow Café. You take one pie order out of habit.", fx: { sermon: -2, harmony: 2 } },
      { text: "Three points, neatly outlined. Then you remember Mrs. Olsen’s rule: “One point, Pastor, and make it Jesus.” You cross out two." },
      { text: "You sketch the sermon on a napkin: what the text says, what it does, where Christ is in it. The napkin is better than most of your drafts." },
      { text: "You read Luther on {gospel}. He is louder than you and also funnier. You borrow a sentence and footnote it in your heart." },
      { text: "A whole hour with {gospel} and a pencil. Nothing dramatic, just the quiet work of listening before you speak.", fx: { sermon: 3 } },
      { text: "You catch yourself preaching at the council in your draft. You delete the paragraph about budgets and go back to the Gospel." },
      { text: "You check the hymns against the readings. “Beautiful Savior” fits like a mitten. You pencil it in before Hannah can object." },
      { text: "You write the children’s sermon first. If you can say it to a six-year-old holding a stuffed giraffe, you can say it to the grown-ups." },
      { text: "You read {gospel} in the old German Bible from the church library. Your German is bad. The Gospel is still good." },
      { text: "You find the law in {gospel} fast. It takes longer to find the gospel in it, and that’s the part they’ll need on Sunday morning.", fx: { sermon: 3 } },
      { text: "You write “WHO NEEDS TO HEAR THIS?” at the top of the page, then a list of faces. The sermon gets kinder.", fx: { sermon: 2, harmony: 1 } },
      { text: "Every commentary on {gospel} disagrees with every other. You decide to preach what the text says and let the scholars have their potluck." },
      { text: "You read your draft aloud and time it: twenty-six minutes. You cut the bit about your seminary roommate. Nineteen. Better." },
      { text: "A legal pad and {gospel}. You draw a little cross in the margin wherever Jesus is the one doing the work. The margin fills up." },
      { text: "A seminary professor’s voice in your head: “Preach the text, not your week.” You delete the paragraph about the copier." },
      { text: "You study in the third pew today, where the sun comes through the Good Shepherd window. It helps more than it should." },
      { text: "Halfway through your notes on {gospel}, Biscuit walks across the keyboard and adds “jjjjjjjjj”. It is the most honest line on the page.", fx: { sermon: -1, strength: 1 } },
      { text: "St. Luke’s pulpit was built in 1911. More than a century of sermons, most of them too long, and God used every one." },
      { text: "You write {sunday} at the top of a clean page. The old Latin names still feel like a door opening. You walk through it into {gospel}." },
      { text: "The readings for {sunday} rhyme with each other in a way you didn’t expect, as if somebody planned it a thousand years ago. Somebody did." },
      { text: "You write one sentence you’re sure of: Christ is for you. You build the rest around it, like a house around a hearth.", fx: { sermon: 4 } },
      { text: "You look up what the old church called {sunday} and why. Ten minutes of happy rabbit trail, then back to {gospel}, refreshed." }
    ],

    pray: [
      { text: "You sit in the dark sanctuary and say nothing for a while. The altar candles are out; the Good Shepherd window keeps watch. “He that keepeth Israel shall neither slumber nor sleep” (Psalm 121:4)." },
      { text: "You pray through the prayer list: names, hips, jobs, babies. Some prayers are just a name said slowly." },
      { text: "You kneel at the communion rail, where your people kneel. It feels different on this side. It’s supposed to." },
      { text: "You try to pray and plan Sunday at the same time. You catch yourself, laugh, and hand God the whole messy list." },
      { text: "Psalm 46, then silence. “Be still, and know that I am God” (Psalm 46:10). You manage still for about four minutes. It counts.", fx: { strength: 2 } },
      { text: "Biscuit joins you in the front pew, purring like a small engine. You pray for the cat too. Nobody said you couldn’t." },
      { text: "You pray the Lord’s Prayer slowly, one line per breath. By “daily bread” your shoulders have come down an inch." },
      { text: "No words today. But “the Spirit itself maketh intercession for us with groanings which cannot be uttered” (Romans 8:26). You let that be enough." },
      { text: "You pray for the people who annoy you, by name. Then for the people you annoy, which takes longer.", fx: { harmony: 2 } },
      { text: "Afternoon light through the stained glass puts a red square on the floor. You sit in it like a cat and pray for your people." },
      { text: "You read Psalm 23 and stop at “I shall not want” (Psalm 23:1). You sit with that for the rest of the hour." },
      { text: "You confess your sins in the empty church, plainly. Then you remember Christ forgave them on the cross, and you walk out lighter.", fx: { strength: 3 } },
      { text: "You pray for Sam and Bea, the sermon, and the people who’ll hear it. Then you stop arranging things and just listen." },
      { text: "“Come unto me, all ye that labour and are heavy laden, and I will give you rest” (Matthew 11:28). You came. You rest.", fx: { strength: 3 } },
      { text: "You pray for the whole town: the Willow Café, the grain elevator, the school bus driver, the folks at First Methodist down the street." },
      { text: "The old pews creak when nobody’s in them. You pray to the sound of a building settling, which is also a kind of prayer." },
      { text: "You meant to pray for an hour and dozed for twenty minutes in the back pew. “For so he giveth his beloved sleep” (Psalm 127:2). Allowed.", fx: { strength: 4, sermon: -1 } }
    ],

    office: [
      { text: "The copier jams on page two of forty bulletins. You open drawer C. You look for drawer D. There is no drawer D. There is a paper clip." },
      { text: "Seventeen voicemails. Nine are about the thermostat. One is a man selling church van insurance. You do not have a church van." },
      { text: "Autocorrect changes “Sabaoth” to “Sabbath” and “Kyrie” to “Kyle” in the bulletin. You fix both. Kyle will be disappointed." },
      { text: "The offering ledger is off by $4.17. You find it two hours later in the coffee jar, which is labelled “Lutherans run on this.”", fx: { building: 2 } },
      { text: "Email for an hour. Inbox: 43. Inbox: 41. Inbox: 46. You close the laptop with dignity." },
      { text: "A synod form asks for average Sunday attendance. You decide, with some regret, that Biscuit does not count." },
      { text: "Five thank-you notes by hand: bulletin folders, coffee-urn crew, the lady who irons the linens. Small thanks, big difference.", fx: { harmony: 3, sermon: -1 } },
      { text: "The newsletter is due. You need 400 words. You have “Greetings in Christ!” and a clip-art dove. It’s a start." },
      { text: "You update the prayer list. Three names come off, thanks be to God, and two go on. The list never empties, and that’s all right." },
      { text: "The paper catalog offers “Festive Flame Red” and “Contemplative Beige.” You order beige. You always order beige." },
      { text: "A telemarketer calls. You end up praying with her. She has a lot going on.", fx: { strength: -2, harmony: 1 } },
      { text: "You file. You file some more. You find the 1987 council minutes, in which someone also complained about the thermostat." },
      { text: "The mail: a seed catalog, three bills, and a crayon drawing of Jesus with enormous hands from a Sunday school kid. You pin up the drawing." },
      { text: "The office printer announces LOW TONER in a tone you find personal." },
      { text: "You draft the council agenda. Item 7: “Thermostat (again).” You move it to item 9 and pray nobody notices." },
      { text: "You check the bulletin’s hymn numbers against the hymnal. Twice. Last time, the congregation sang a funeral hymn at a wedding." },
      { text: "The coffee urn needs descaling and you’re the only one who knows where the vinegar is. This, too, is ministry." },
      { text: "You phone the shut-ins on the list to say hello. Each call is short. Each one is the best part of someone’s day.", fx: { harmony: 3, strength: -2 } },
      { text: "A man calls to ask if St. Luke’s does weddings for “mostly spiritual” people. You have a long, kind talk. He might come Sunday." },
      { text: "A teenager rearranged the church sign from COME AS YOU ARE to COME AS YOUR ARE. You fix it. It’s still true." },
      { text: "Pete’s budget spreadsheet is color-coded. Green is good. Yellow is “pray.” Red is “pray harder.” There is a lot of yellow.", fx: { building: 2 } },
      { text: "You type up the altar flower calendar. Easter is booked solid. The Sundays after it are wide open, which is how it always goes." }
    ],

    property: [
      { text: "You walk the building with a flashlight. The basement smells like 1962. A mouse looks at you as if you’re the one trespassing." },
      { text: "Gus shows you the crack in the parking lot. He has named it. It’s called “The Gorge.”" },
      { text: "Three lightbulbs changed in the fellowship hall. The fourth needs the tall ladder, which needs Gus, who needs coffee." },
      { text: "The bell rope is fraying. You tie a knot and make a note for council. The bell will ring Sunday. Probably." },
      { text: "Old hymnals in the attic, each with a name inked inside. You put them back carefully, as if you’d found the people." },
      { text: "The hymn board is missing every 7. You make one out of two 1s and some tape. Nobody will notice except Marge." },
      { text: "The downstairs toilet is running again. You jiggle the handle and leave Gus a note. Nobody mentioned plumbing at your ordination.", fx: { building: 3, strength: -2 } },
      { text: "The front door sticks again. Gus planes it while explaining, lovingly, everything the last trustees did wrong. You hold the flashlight." },
      { text: "The gutters contain leaves, a tennis ball and a bulletin from 1998. You keep the bulletin." },
      { text: "The steeple light is out. You and Gus squint up at it from the parking lot and agree, as people of faith, that it’s a job for later." },
      { text: "Biscuit has found a way into the organ chamber again. You block it with a hymnal. She finds another." },
      { text: "The trustees paint over the scuff marks in the narthex. You bring doughnuts. It looks brand new, if new means 1974.", fx: { building: 3 } },
      { text: "Ninety-one folding chairs. Last year, ninety-three. The chairs are leaving, one at a time, for other congregations." },
      { text: "Gus patches the Sunday school wall where an enthusiastic Noah’s Ark lesson put a giraffe through the drywall. You hand him things.", fx: { building: 4, strength: -2 } }
    ],

    rounds: [
      { text: "Willow Creek Memorial has twelve beds and Nurse Carol knows everyone in them. Room 3, a farmer, wants to talk soybeans. You talk soybeans. Then you pray." },
      { text: "A woman you don’t know asks you to pray with her before surgery. You do. Her hand is cold, then it isn’t." },
      { text: "Communion for Mr. Krause at the care center. He forgets your name and remembers every word of the Lord’s Prayer." },
      { text: "Elsie at Pine Haven tells you the story of the 1965 flood again. You laugh in the same places, because it’s a good story." },
      { text: "Nurse Carol hands you a coffee without asking. “Room 6 has no visitors,” she says. You go to Room 6.", fx: { strength: -2, harmony: 2 } },
      { text: "A young dad in the waiting room isn’t a member of anything. You sit with him. You don’t fix it. You just stay." },
      { text: "Arne is two days out of knee surgery and already asking when he can mow the church lawn. Not this week, Arne." },
      { text: "A St. Luke’s member at Pine Haven receives the Lord’s Supper for the first time in two years. She weeps at “given and shed for you.” So, a little, do you." },
      { text: "You read Psalm 121 to a woman who can’t open her eyes today. At “My help cometh from the LORD” (Psalm 121:2), her thumb moves on your hand." },
      { text: "Four rooms at the care center, four stories, one bag of peppermints. The peppermints run out first." },
      { text: "The hospital chapel has a fake plant and a real Bible. You sit there for five minutes between visits and breathe.", fx: { strength: 2 } },
      { text: "A teenager in the ER after a fender-bender, banged up but fine. His mom grips your arm: “Thank you for coming.” You barely did anything. You came." },
      { text: "Mrs. Dahl at Pine Haven turns 100 next week and wants to know if you’ll bring cake. Of course you’ll bring cake." }
    ],

    cafe: [
      { text: "Deb pours your coffee before you sit. “Rhubarb pie today, Pastor.” It isn’t rhubarb season. You don’t ask." },
      { text: "The farmers at the round table ask your opinion on the weather. You say God’s in charge. They say God should talk to the co-op." },
      { text: "A woman from First Methodist tells you your church sign has a typo. You thank her. You both laugh. Ecumenism!" },
      { text: "Deb’s pie case: apple, cherry, and “sour cream raisin (don’t knock it).” You knock it. Then you try it. You were wrong." },
      { text: "A stranger says, “You’re the Lutheran one, right?” and tells you about her mother’s surgery. You pray with her right there by the napkin holder.", fx: { harmony: 3, strength: -2 } },
      { text: "The café radio plays polka. Two old men at the counter keep time with their spoons. You leave a bigger tip than you meant to." },
      { text: "Deb asks if pastors ever get a day off. You say yes. She raises one eyebrow very high. Deb knows things." },
      { text: "You jot sermon notes on a napkin. A farmer reads over your shoulder. “That one’s good. Use that.” You use that.", fx: { sermon: 2 } },
      { text: "The high schoolers in the corner booth are cramming for chemistry. You remember nothing about chemistry. You buy them fries." },
      { text: "The mayor (also the hardware store) asks if St. Luke’s can host the blood drive. You say yes before checking with Pete. Oh well." },
      { text: "Deb’s coffee could stand a spoon up. Two cups and you briefly understand Greek.", fx: { strength: 2 } },
      { text: "An old man at the counter hasn’t been to church since 1979. “Roof fell in,” he says. He doesn’t mean the church’s roof. You sit down beside him." },
      { text: "Lemon meringue today. Deb cuts you a slice “for the sermon.” You’re not sure how pie helps a sermon. It does." },
      { text: "A trucker passing through asks for directions and a prayer, in that order. You give both." },
      { text: "Father Mike from St. Bridget’s meets you for coffee, as he does every month. You compare boilers. His is from 1958. He wins." },
      { text: "On the café bulletin board, between a lost dog and a tractor for sale, your church flyer. Someone has drawn a mustache on the sheep." }
    ],

    rest: [
      { text: "You nap on the couch with a book on your chest. Sam tucks a blanket over you and takes the book. You wake and pretend you were reading." },
      { text: "Soup from whatever’s in the fridge. It’s mostly carrots. It’s good." },
      { text: "You don’t answer the phone for one whole hour. The church does not fall down. It’s Christ’s church; it has survived worse than your afternoon off." },
      { text: "A long walk by the creek. You don’t think about the sermon. Then the sermon comes to you anyway, uninvited, by the willows.", fx: { sermon: 2 } },
      { text: "You read a novel with no theology in it. You find some anyway. Occupational hazard." },
      { text: "You sleep in. Sam brings coffee. “I will both lay me down in peace, and sleep” (Psalm 4:8). The world turns without your help." },
      { text: "You putter in the garage fixing a birdhouse nobody asked you to fix. It’s the most peaceful hour of the week." },
      { text: "Bath, tea, early to bed. Rest isn’t something you earn. It’s something you’re given. You receive it." },
      { text: "You sit on the parsonage porch and watch Willow Creek go by: three pickups, a dog, the mail truck, Biscuit (how did she get here?)." },
      { text: "You play the piano badly for half an hour. Nobody’s listening but God, and God is very kind about it." },
      { text: "You turn off your phone and bake bread. The dough needs time, and so do you." },
      { text: "You lie on the living-room rug with your eyes closed. The fridge hums. Sam turns a page. Bea sings to herself upstairs.", fx: { family: 2 } },
      { text: "“Come ye yourselves apart into a desert place, and rest a while” (Mark 6:31). Willow Creek is not a desert, but the back porch will do." }
    ],

    family: [
      { text: "Bea teaches you a card game with rules she invents as she goes. You lose. Somehow you also owe her a cookie." },
      { text: "Supper with no phones at the table. Sam tells a story about the grocery store that makes you laugh milk out of your nose." },
      { text: "You and Bea build a fort out of couch cushions. It is declared a church. You are allowed to preach for exactly one minute." },
      { text: "A walk with Sam after supper. You don’t mention church once. Sam notices. Sam smiles." },
      { text: "Spelling words with Bea. “Resurrection” isn’t on the list. She adds it anyway, to impress her teacher." },
      { text: "Bea asks if God can hear her if she prays really quietly. You say God hears quieter than that. She tests it with a whisper." },
      { text: "Pancakes for supper. Bea makes one shaped like Biscuit. It’s shaped like a potato. You say it’s perfect." },
      { text: "You read Bea a chapter in three voices. She corrects your badger." },
      { text: "You and Sam finally watch a whole movie. You fall asleep at the good part. Sam tells you what happened. It sounds great." },
      { text: "Game night. Bea wins and does a victory dance. Sam wins and does a quieter one. You win nothing and do the dishes." },
      { text: "Bea says grace at supper. It runs long and includes the cat, the mail carrier and “all the worms.” Amen." },
      { text: "You and Sam on the porch steps after Bea’s asleep, sharing one cup of decaf. Still the best part of the day.", fx: { strength: 2 } },
      { text: "You teach Bea to whistle. She learns in ten minutes. You’ve been working on it for thirty years." },
      { text: "Bea draws the family. You’re the one in black holding a cup of coffee. It’s accurate." },
      { text: "Sam cuts your hair in the kitchen. Not the best haircut. The best fifteen minutes of the week." },
      { text: "Bea asks why you work Sundays. “It’s the day everybody comes home to God,” you say. She thinks. “Even you?” Even you." },
      { text: "You pack Bea’s lunch with a note: a joke and a Bible verse. She reports that her friends liked the joke better." }
    ]
  },

  // ───────────────────────── 2. Cast stories ─────────────────────────
  stories: {

    olsen: [
      { id: "olsen1", when: { minWeek: 0, maxWeek: 2, at: "home" }, title: "Communion at the Card Table",
        text: "Mrs. Olsen has the card table ready: white cloth, a candle, and a plate of lefse “for after.” She’s been dressed since seven. “Well, Pastor? The Lord’s Supper won’t serve itself.”",
        choices: [
          { label: "Stay for lefse and stories", fx: { olsen: -25, strength: -4, sermon: -3 },
            reply: "You give her Christ’s body and blood, then stay an hour. She tells you about teaching Sunday school in 1958, when the furnace ran on coal and the children ran on sugar." },
          { label: "Communion, a prayer, and go", fx: { olsen: -12, sermon: 4 },
            reply: "“Take, eat; this is my body” (Matthew 26:26). She receives it with her eyes shut, like a girl. At the door she presses warm lefse into your hands anyway." }
        ] },

      { id: "olsen2", when: { minWeek: 2, maxWeek: 4, at: "home" }, title: "Ninety-One Christmases",
        text: "She can’t manage the icy church steps, so this will be her first Christmas Eve at home in sixty years. “I’ll be fine,” she says, in the voice of someone who will not be fine.",
        choices: [
          { label: "Bring Bea to sing her carols", fx: { olsen: -22, family: 5, strength: -4 },
            reply: "Bea sings “Away in a Manger” off-key and with total conviction. Mrs. Olsen claps, then quietly wipes her eyes with the tea towel." },
          { label: "Ask the elders to carry her in", fx: { olsen: -18, harmony: 5, strength: -3 },
            reply: "Two elders and a borrowed wheelchair get her into the third pew. She holds her candle steady through every verse of “Silent Night.”" },
          { label: "Have Josh record the service", fx: { olsen: -10, josh: -6, sermon: 2 },
            reply: "Josh records it on his phone “for the lefse lady.” She watches it three times and reports that the sermon was good and the tenors were flat." }
        ] },

      { id: "olsen3", when: { minWeek: 5, maxWeek: 7, at: "hospital", flag: "olsenHospital" }, title: "A Hip and a Grudge",
        text: "Day three after hip surgery. Mrs. Olsen is sharp as ever and furious about the hospital jello. “It’s green, Pastor. Jello should not be green.”",
        choices: [
          { label: "Read Psalm 121 with her", fx: { olsen: -20, strength: -2 },
            reply: "She knows it better than you. “My help cometh from the LORD” (Psalm 121:2). At the end she squeezes your hand. “Now take the jello away.”" },
          { label: "Sneak her a slice of Deb’s pie", fx: { olsen: -15, strength: 2 },
            reply: "Nurse Carol catches you and pretends not to. “I didn’t see that,” she says, “and neither did her blood sugar.” Mrs. Olsen eats every crumb." },
          { label: "Pray, then hurry back to work", fx: { olsen: -8, sermon: 5 },
            reply: "She waves you off. “Go write something good. I’ll listen on the radio.” St. Luke’s isn’t on the radio. You don’t correct her." }
        ] },

      { id: "olsen4", when: { minWeek: 6, maxWeek: 8, at: "hospital", flag: "olsenHospital" }, title: "Two A.M. Is the Worst Hour",
        text: "Nurse Carol says she’s restless at night. When you come, Mrs. Olsen admits it: “I’m not afraid of dying, Pastor. I’m afraid of being a bother while I do it.”",
        choices: [
          { label: "Stay until she falls asleep", fx: { olsen: -25, strength: -8, family: -4 },
            reply: "You read Isaiah: “even to hoar hairs will I carry you” (Isaiah 46:4). “Hoar hairs,” she murmurs. “That’s me.” She’s asleep before the next verse." },
          { label: "Pray and leave your pocket cross", fx: { olsen: -14, strength: -2, sermon: 2 },
            reply: "You pray and leave her the little wooden cross from your pocket. Carol reports she held it all night and only complained about the jello twice." }
        ] },

      { id: "olsen5", when: { minWeek: 8, maxWeek: 10, at: "home" }, title: "Home, with a Walker",
        text: "She’s home, with a walker she has named Arvid after her late husband, “because it’s slow and it follows me everywhere.” Her Lenten devotional is already dog-eared.",
        choices: [
          { label: "Bring her communion again", fx: { olsen: -22, strength: -3 },
            reply: "The card table, the candle, the cup. “Given and shed for you,” you say. “For me,” she answers firmly, as if someone might argue." },
          { label: "Fix her loose porch rail", fx: { olsen: -15, strength: -5, family: -2 },
            reply: "Gus brings his drill and you hold the screws. Mrs. Olsen supervises from the window and knocks on the glass every time you drop one." },
          { label: "Take home her prayer list", fx: { olsen: -10, harmony: 4 },
            reply: "Forty names in pencil, updated weekly. Half your congregation is on it. She has been praying them through every winter for years." }
        ] },

      { id: "olsen6", when: { minWeek: 9, maxWeek: 11, at: "home" }, title: "The Index Card",
        text: "She hands you an index card. FUNERAL. Hymns: “I Know That My Redeemer Lives,” “Abide with Me.” Job 19:25. No eulogy over four minutes. Lefse at the lunch. “Don’t make that face, Pastor.”",
        choices: [
          { label: "Go over it with her, line by line", fx: { olsen: -22, strength: -5 },
            reply: "“For I know that my redeemer liveth” (Job 19:25). She reads it aloud with you. “That’s the whole sermon,” she says. “Say that, and sit down.”" },
          { label: "Say there’s plenty of time", fx: { olsen: -6, strength: 2 },
            reply: "“Pastor, I’m ninety-one. Take the card.” You take the card. She pats your hand like one of her Sunday school boys who forgot his memory verse." },
          { label: "Ask why these hymns", fx: { olsen: -18, sermon: 4, strength: -3 },
            reply: "“Arvid and I had the Redeemer hymn at our wedding,” she says. “People thought it was odd for a wedding. But it’s true at weddings too.”" }
        ] },

      { id: "olsen7", when: { minWeek: 11, maxWeek: 11, at: "home" }, title: "The Thief’s Prayer",
        text: "Her daughter Karen has come from Minneapolis, which tells you something. Mrs. Olsen is thinner, mostly in her chair. “Read me Luke 23, Pastor. The thief. That’s my favorite part.”",
        choices: [
          { label: "Read the Passion aloud", fx: { olsen: -22, strength: -4, sermon: 3 },
            reply: "“Lord, remember me when thou comest into thy kingdom” (Luke 23:42). She mouths the answer with you: “To day shalt thou be with me in paradise” (Luke 23:43)." },
          { label: "Have coffee with Karen", fx: { olsen: -12, harmony: 3, strength: -3 },
            reply: "In the kitchen Karen says, “She’s been planning this for years, you know.” She has a copy of the index card too. You both laugh, and then neither of you does." },
          { label: "Pray briefly, let her rest", fx: { olsen: -8, strength: 3, sermon: 3 },
            reply: "A short prayer, a hand on her shoulder. “Christ is risen on Sunday,” she whispers as you go, “whether I’m awake for it or not.”" }
        ] },

      { id: "olsen8", when: { minWeek: 12, maxWeek: 12, at: "home", notFlag: "olsenDied" }, title: "Lord, Now Lettest Thou",
        text: "The hospice nurse meets you at the door. Mrs. Olsen sleeps most of the time now, Karen holding her hand. When you say her name she opens her eyes and whispers, “Christ is risen.”",
        choices: [
          { label: "Sing “Abide with Me” softly", fx: { olsen: -30, strength: -6 }, set: "olsenDied",
            reply: "You sing the verses you remember; Karen sings the ones you don’t. Mrs. Olsen died before dawn, at peace, with the curtains open to the morning." },
          { label: "Commend her to God", fx: { olsen: -30, strength: -4 }, set: "olsenDied",
            reply: "The Litany for the Dying, then Simeon’s song: “Lord, now lettest thou thy servant depart in peace, according to thy word” (Luke 2:29). Karen calls at sunrise. She died in her sleep." },
          { label: "Sit with Karen in the kitchen", fx: { olsen: -20, harmony: 4, strength: -5 }, set: "olsenDied",
            reply: "You make the coffee and let Karen talk. Near midnight the nurse comes to the doorway. Mrs. Olsen has gone to her Lord, quietly, the way she did most things." }
        ] }
    ],

    gus: [
      { id: "gus1", when: { minWeek: 0, maxWeek: 1, notFlag: "boilerDead" }, title: "Meet Old Faithful",
        text: "Gus pats the boiler like a horse. “Installed 1962. My dad helped carry her in. She’s got a hum when she’s happy and a cough when she’s not.” Right now she’s coughing.",
        choices: [
          { label: "Pat the boiler too", fx: { gus: -15, strength: -2 },
            reply: "You pat her. She coughs. Gus nods as if you’ve been formally introduced. “She likes you,” he says. You’re not sure that’s good news." },
          { label: "Ask what a new one costs", fx: { gus: -6, building: 5 },
            reply: "Gus looks at you as if you’d asked the price of a new grandmother. “Thirty-some thousand,” he mutters. “Don’t say it in front of her.”" }
        ] },

      { id: "gus2", when: { minWeek: 1, maxWeek: 3, flag: "boilerDead" }, title: "A Wake in the Boiler Room",
        text: "You find Gus on an upturned bucket beside the cold boiler, cap in his hands. “Dad and I put her in the summer I was fifteen,” he says. “Silly, being sad about a furnace.”",
        choices: [
          { label: "Sit on the other bucket", fx: { gus: -22, strength: -3, sermon: -2 },
            reply: "You sit. He tells you about his dad, the summer of 1962, the hymn they sang at the dedication. It isn’t silly. Nothing you love is." },
          { label: "Start a boiler fund jar", fx: { gus: -10, building: 6 },
            reply: "You label a pickle jar OLD FAITHFUL II. Gus drops in a twenty, then a five, then his lucky quarter. “For the new girl,” he says." }
        ] },

      { id: "gus3", when: { minWeek: 3, maxWeek: 5 }, title: "The Thermostat Lockbox",
        text: "Gus has fitted a clear plastic lockbox over the thermostat for the rented heater. He has the only key. “For safety,” he says. Marge has been seen near it with a bobby pin.",
        choices: [
          { label: "Ask Gus for the key", fx: { gus: 8, marge: -10, harmony: 4 },
            reply: "Gus hands it over like a man surrendering a sword. You hang it on the hymn board hook, where everyone can see it and no one may touch it." },
          { label: "Let it be, for now", fx: { gus: -10, marge: 8, harmony: -5 },
            reply: "The lockbox stays. By Sunday a note is taped to it: “WHOSE CHURCH IS IT?” In Marge’s handwriting. Or Gus’s. Hard to tell anymore." },
          { label: "Bring them both pie", fx: { gus: -6, marge: -6, strength: -3, harmony: 3 },
            reply: "Deb’s apple pie, two forks, one table. They eat in silence, then argue about whether the crust is too thick. Progress, of a kind." }
        ] },

      { id: "gus4", when: { minWeek: 6, maxWeek: 8 }, title: "The Boiler Breakfast",
        text: "Gus has a plan: a Boiler Breakfast. Pancakes, sausage, lefse, and a raffle for his hand-carved birdhouse. “Whole town comes to a pancake breakfast,” he says. “Even the Methodists.”",
        choices: [
          { label: "Flip pancakes all morning", fx: { building: 10, harmony: 5, strength: -8, gus: -12 },
            reply: "You flip 412 pancakes; Bea counts. The Methodists come, and the Catholics, and a stranger who buys six raffle tickets. The boiler fund jumps $3,800." },
          { label: "Bless it and let Gus run it", fx: { building: 6, gus: -15, sermon: 3 },
            reply: "You say grace over the griddles and leave Gus in command. He is a natural general. The syrup supply lines never falter." },
          { label: "Ask Marge to co-chair", fx: { building: 9, harmony: -3, gus: 5, marge: 5 },
            reply: "It is the most efficient, most passive-aggressive pancake breakfast in county history. Excellent profits. Nobody speaks in the kitchen." }
        ] },

      { id: "gus5", when: { minWeek: 9, maxWeek: 11 }, title: "Delivery Day",
        text: "A flatbed backs up to the church with the new boiler: small, shiny, humming. The crew wheels Old Faithful out the side door. Gus takes off his cap.",
        choices: [
          { label: "Say a prayer of thanks", fx: { gus: -18, harmony: 5, strength: -2 }, set: "newBoiler",
            reply: "You thank God for sixty-four winters of warmth, for the hands that built it and the hands that will keep the new one. Gus’s “Amen” echoes off the pipes." },
          { label: "Help haul the old one out", fx: { gus: -15, building: 5, strength: -7 }, set: "newBoiler",
            reply: "It takes six people and a dolly. Gus pats the old girl once more on the trailer. Then he goes down to read the new one’s manual. All 96 pages." }
        ] },

      { id: "gus6", when: { minWeek: 11, maxWeek: 13, flag: "newBoiler" }, title: "The New Girl Needs a Name",
        text: "The new boiler hums like it’s trying out for the choir. Gus is talking to it when you come in. “Don’t tell anybody. She needs a name, and I can’t pick one that isn’t Old Faithful.”",
        choices: [
          { label: "Let Bea name it", fx: { gus: -15, family: 6, strength: -2 },
            reply: "Bea studies the boiler gravely and names it “Toasty.” Gus objects for one minute, then makes a sign. By Sunday the whole congregation calls it Toasty." },
          { label: "Suggest “Faithful Too”", fx: { gus: -18 },
            reply: "“Faithful Too,” Gus repeats. He writes it on masking tape, sticks it on the side, and steps back like a man who has hung a painting." },
          { label: "Tell him to pray, not just talk", fx: { gus: -12, sermon: 3 },
            reply: "“Talking to a boiler’s fine,” you say. “Talking to God about it is better.” So he does, out loud: for the boiler, the building and everyone it keeps warm." }
        ] },

      { id: "gus7a", when: { minWeek: 12, maxWeek: 15, flag: "margeStory", notFlag: "trucePact" }, title: "What Gus Didn’t Know",
        text: "With Marge’s permission you tell Gus why she keeps it at 64: the 1981 heating bill that nearly closed St. Luke’s, and Leonard up nights over the books. Gus is quiet a long time.",
        choices: [
          { label: "Let him sit with it", fx: { gus: -15, harmony: 6 },
            reply: "“I was on council in ’81,” Gus says at last. “Voted to shut the balcony to save heat. Leonard never said what it cost him.” He goes off to find Marge." },
          { label: "Suggest a compromise number", fx: { gus: -8, harmony: 4, building: 3 },
            reply: "“Sixty-seven,” Gus says slowly. “Split the difference and add one for Leonard.” He writes it on a napkin to bring to the potluck." }
        ] },

      { id: "gus7b", when: { minWeek: 12, maxWeek: 15, notFlag: "trucePact" }, title: "Gus’s Presentation",
        text: "For the spring potluck Gus has prepared a laminated chart: “Optimal Sanctuary Temperatures, 1962–Present.” It includes a pie chart. He’d like you to review it.",
        choices: [
          { label: "Review it, seriously", fx: { gus: -12, strength: -3, sermon: -2 },
            reply: "It’s a very good chart. You suggest he leave out the page titled “Marge: A History.” He agrees, grudgingly, and laminates a new one." },
          { label: "Ask him to bring pie instead", fx: { gus: 5, harmony: 5 },
            reply: "“Pie,” Gus says, as if you’d suggested a hamster. But on Saturday he turns up with rhubarb, and the chart stays in the truck." }
        ] },

      { id: "gus8", when: { minWeek: 15, maxWeek: 17, flag: "trucePact" }, title: "Sixty-Seven Degrees",
        text: "The lockbox is gone. In its place, a card in two handwritings: “67°F, by treaty. Do not touch. G.B. & M.L.” Gus is wearing a new green scarf.",
        choices: [
          { label: "Admire the scarf", fx: { gus: -15, harmony: 4 },
            reply: "“Marge made it,” he says gruffly. “Says I’ll be cold at sixty-seven.” He is not cold. He wears it anyway, every Sunday." },
          { label: "Ask after the new boiler", fx: { gus: -10, building: 5 },
            reply: "It hums along beautifully. Gus shows you the log: entries in his neat block capitals, and one in Marge’s hand: “Thank you for keeping us warm.”" }
        ] }
    ],

    marge: [
      { id: "marge1", when: { minWeek: 0, maxWeek: 2 }, title: "The Altar Guild Way",
        text: "Marge Lindqvist irons the Advent paraments with the focus of a surgeon. “Sixty-four degrees,” she says without looking up. “Lutherans are hardy. Also, the candles drip less.”",
        choices: [
          { label: "Ask her to teach you to iron", fx: { marge: -18, strength: -3 },
            reply: "She shows you how to fold a purificator in thirds, then refolds it. “Close,” she says. From Marge, “close” is a medal." },
          { label: "Gently mention 68 degrees", fx: { marge: 6, building: 2 },
            reply: "Marge sets the iron down. “Pastor. In 1981 we nearly lost this church to a heating bill.” She picks the iron back up. That is the end of it, for now." },
          { label: "Admire the embroidery", fx: { marge: -12, harmony: 2 },
            reply: "“My mother stitched these in 1952,” she says, softening. “Every stitch.” She lets you hold a corner. It feels like holding history." }
        ] },

      { id: "marge2", when: { minWeek: 2, maxWeek: 4, flag: "boilerDead" }, title: "Poinsettia Evacuation",
        text: "With the boiler dead, Marge fears for the forty poinsettias ordered for Christmas. “They’ll freeze, Pastor. They’re tropical.” She looks hopefully toward the parsonage.",
        choices: [
          { label: "Host them at the parsonage", fx: { marge: -20, family: -4, harmony: 3 },
            reply: "Forty poinsettias fill your living room. Bea names every one. Sam finds one in the bathtub. On Christmas Eve they arrive at church alive and glorious." },
          { label: "Ask Gus for a space heater", fx: { marge: -10, gus: 6, harmony: -2 },
            reply: "Gus delivers a space heater to the poinsettias “under protest.” Marge thanks him “under protest.” The poinsettias, at least, are warm." },
          { label: "Trust the poinsettias", fx: { marge: 8, strength: 2 },
            reply: "“They’re tougher than they look,” you say. Marge gives you her wrinkled-altar-cloth look. Three die. She mentions it until Lent." }
        ] },

      { id: "marge3", when: { minWeek: 5, maxWeek: 8 }, title: "Why Sixty-Four",
        text: "Over coffee Marge finally tells you. 1981: a heating bill St. Luke’s couldn’t pay. Her Leonard was treasurer and sat up nights over the books until they found a way. “Sixty-four keeps his church open.”",
        choices: [
          { label: "Promise to keep her secret", fx: { marge: -22, strength: -2 },
            reply: "“Thank you,” she says, and squeezes your hand once, hard. On your way out she turns the thermostat up to 65. Just for you." },
          { label: "Ask if you may tell Gus", fx: { marge: -10, harmony: 5 }, set: "margeStory",
            reply: "She thinks a long time. “Leonard always said Gus was a good man under the grease. Tell him, if you think it’ll help.”" },
          { label: "Thank her for her faithfulness", fx: { marge: -15, sermon: 3 },
            reply: "“Faithful?” Marge snorts. “Stubborn.” But she’s pleased. Sunday’s sermon gets a line, no names: the people who keep the lights on so the Word can be heard." }
        ] },

      { id: "marge4", when: { minWeek: 8, maxWeek: 10 }, title: "Her Hands",
        text: "Marge’s hands shake as she sets out the communion ware. She puts down the flagon and doesn’t pick it back up. “I’m seventy-eight,” she says. “Maybe it’s time someone younger did this.”",
        choices: [
          { label: "Ask her to train someone", fx: { marge: -20, harmony: 5, strength: -2 },
            reply: "Linh Nguyen volunteers. Marge looks her over like a sergeant inspecting a recruit. “You’ll do,” she says. A partnership is born." },
          { label: "Shaky hands don’t matter", fx: { marge: -15, strength: -2 },
            reply: "“The Sacrament doesn’t depend on steady hands,” you say. “Not yours, not mine. It’s Christ’s gift.” She picks up the flagon again, with both hands this time." },
          { label: "Talk about it after Easter", fx: { marge: 5, sermon: 4 },
            reply: "Marge nods, relieved and a little hurt. She polishes the chalice twice." }
        ] },

      { id: "marge5", when: { minWeek: 10, maxWeek: 11 }, title: "The Moth Hole",
        text: "Disaster: a moth has eaten a hole the size of a dime in the white Easter frontal. Marge holds it up to the window like evidence at a trial. “On Easter, Pastor. On EASTER.”",
        choices: [
          { label: "“Christ is risen anyway”", fx: { marge: -10, strength: 2 },
            reply: "Marge stares at you. Then, unexpectedly, she laughs. “Leonard would have said that.” She patches it anyway, of course." },
          { label: "Help her mend it tonight", fx: { marge: -20, family: -5, strength: -4 },
            reply: "You thread needles while Marge mends. By eleven the hole is gone. “Terrible eyes, good hands,” she says of you. You’ll take it." },
          { label: "Hide it behind a lily", fx: { marge: -6, harmony: 3 },
            reply: "One well-placed lily covers it perfectly. Marge knows it’s there. God knows it’s there. Nobody else ever finds out." }
        ] },

      { id: "marge6", when: { minWeek: 13, maxWeek: 15, notFlag: "trucePact" }, title: "Marge’s Exhibit A",
        text: "Marge has heard about Gus’s laminated chart. She has made her own: “Heating Cost per Hymn Verse, 1981–Present.” It is color-coded. Pete helped.",
        choices: [
          { label: "Admire it, then file it", fx: { marge: -10, harmony: 3 },
            reply: "You admire it sincerely, then suggest it would look lovely in a drawer. Marge sniffs. “Pete said it was his best work.”" },
          { label: "Suggest Leonard’s favorite pie", fx: { marge: -15, harmony: 4, strength: -2 },
            reply: "“Sour cream raisin? Nobody’s made it since Leonard passed.” On Saturday she brings one. Gus has three pieces." }
        ] },

      { id: "marge7", when: { minWeek: 15, maxWeek: 17, flag: "trucePact" }, title: "Knitting for the Enemy",
        text: "Marge is knitting something long and green. “It’s for Gus,” she says, not looking up. “He’ll be cold at sixty-seven, the old fool.” She smiles at the needles.",
        choices: [
          { label: "Tell her it’s beautiful", fx: { marge: -15 },
            reply: "“It’s adequate,” she says. It’s beautiful. She adds a little white cross at one end, “so he knows whose side I’m on.”" },
          { label: "Ask her to teach Bea", fx: { marge: -12, family: 5, strength: -2 },
            reply: "Bea learns to cast on in an afternoon and knits Biscuit a scarf by Friday. Biscuit declines to wear it. Marge declares Bea “altar guild material.”" }
        ] }
    ],

    nguyen: [
      { id: "nguyen1", when: { minWeek: 0, maxWeek: 2 }, title: "A Box Marked KITCHEN?",
        text: "The Nguyens transferred from a Lutheran church in Houston and live mostly in boxes, one labelled “KITCHEN?” in hopeful marker. Daniel teaches chemistry; Linh is five months along.",
        choices: [
          { label: "Bring a church hotdish", fx: { nguyen: -18, harmony: 3, strength: -2 },
            reply: "Marge’s tater-tot hotdish, still warm. Daniel eats it from the pan. “So it’s a casserole?” “It’s a hotdish,” you explain. “It’s different.” It isn’t." },
          { label: "Give them the town tour", fx: { nguyen: -22, strength: -5, sermon: -2 },
            reply: "Grocery, pharmacy, clinic, the good sledding hill, and the Willow Café, where Deb gives them free pie. “Okay,” Linh says. “I think we live here now.”" },
          { label: "Invite them to Advent vespers", fx: { nguyen: -10, harmony: 5, sermon: 2 },
            reply: "They come Wednesday, sit in the back, and are adopted by four grandmothers before the soup is served. Linh leaves with three phone numbers and a bootee." }
        ] },

      { id: "nguyen2", when: { minWeek: 2, maxWeek: 5 }, title: "First Christmas Away",
        text: "Linh’s parents are in California and Daniel’s are in Houston. It’s their first Christmas far from both. “It’s fine,” says Linh. Behind her, Daniel shakes his head: it is not fine.",
        choices: [
          { label: "Invite them for Christmas dinner", fx: { nguyen: -25, family: 3, strength: -5 },
            reply: "Sam makes ham, Linh brings spring rolls, Bea demands the recipe. Daniel says grace in Vietnamese and then English. The ham and the spring rolls get along beautifully." },
          { label: "Introduce them to Walt", fx: { nguyen: -15, walt: -10, strength: -2 },
            reply: "Walt, who has nobody, and the Nguyens, who have nobody here, end up eating pie at the café on Christmas afternoon. Walt teaches Daniel cribbage. Nobody says why." },
          { label: "Give them a Christmas Eve job", fx: { nguyen: -12, harmony: 4 },
            reply: "Daniel runs the candle lighting with a chemist’s precision; Linh hands out bulletins and learns forty names. Being needed turns out to be a kind of welcome." }
        ] },

      { id: "nguyen3", when: { minWeek: 5, maxWeek: 8 }, title: "Fourteen Books",
        text: "The nursery is half-painted; fourteen parenting books are on the floor. Daniel asks the real question: “How do we raise her in the faith when we’re not sure we’re doing it right ourselves?”",
        choices: [
          { label: "Faith is God’s gift, not a grade", fx: { nguyen: -22, sermon: 3 },
            reply: "“You don’t hand her a faith you’ve perfected,” you say. “You bring her to the One who gives it: font, table, bedtime prayers. God does the heavy lifting.”" },
          { label: "Help paint the nursery", fx: { nguyen: -18, strength: -6, family: -3 },
            reply: "Two coats of Buttercup Whisper. By the end Daniel is laughing at the books. “Maybe I’ll just read her the Bible,” he says. Good plan." },
          { label: "Pray for the three of them", fx: { nguyen: -15, strength: -1 },
            reply: "You pray in the nursery doorway: for Linh, for Daniel, and for the little one God already knows by name. Linh cries a little. “Good crying,” she says." }
        ] },

      { id: "nguyen4", when: { minWeek: 9, maxWeek: 10, at: "hospital", flag: "inLabor" }, title: "Grace",
        text: "Room 7, Willow Creek Memorial. Six pounds eleven ounces, a shock of black hair, a cry like a tiny trumpet. “Her name is Grace,” Linh says, exhausted and shining. “Because that’s what she is.”",
        choices: [
          { label: "Hold her and give thanks", fx: { nguyen: -25, strength: -4 }, set: "graceBorn",
            reply: "She weighs nothing and everything. You give thanks for her: “I am fearfully and wonderfully made” (Psalm 139:14). Daniel says “Amen” three times." },
          { label: "Fetch the parents real food", fx: { nguyen: -20, strength: -5, harmony: 3 }, set: "graceBorn",
            reply: "Two burgers, fries and a slice of pie Deb insisted on. Daniel eats like a man who forgot food existed. Linh eats the pie." },
          { label: "Pray, then let them rest", fx: { nguyen: -14, strength: 2, sermon: 3 }, set: "graceBorn",
            reply: "A short prayer at the door, and you go. Nurse Carol nods. “New parents need sleep more than sermons.” You may put that on a mug." }
        ] },

      { id: "nguyen5", when: { minWeek: 10, maxWeek: 12, flag: "graceBorn", notFlag: "baptismPlanned" }, title: "Shouldn’t She Choose?",
        text: "Linh rocks Grace and asks it gently: “Shouldn’t she choose for herself when she’s older? It feels like a lot to decide for her.” Daniel looks at you, waiting.",
        choices: [
          { label: "Baptism is God’s gift to her", fx: { nguyen: -22, sermon: 3 }, set: "baptismPlanned",
            reply: "“In baptism God does the choosing,” you say. “For the promise is unto you, and to your children” (Acts 2:39). Linh looks down at Grace. “Easter 2, then?”" },
          { label: "Answer every question they have", fx: { nguyen: -25, strength: -5 }, set: "baptismPlanned",
            reply: "Two hours and a pot of tea: why water, why babies, what if she doubts later. “God’s promise doesn’t expire,” you say. They choose Easter 2." },
          { label: "Set the date, talk more later", fx: { nguyen: -12, sermon: 4 }, set: "baptismPlanned",
            reply: "You pencil in Easter 2 and leave a Small Catechism open to Baptism. Daniel texts that night: “Read it twice. It’s not about us. What a relief.”" }
        ] },

      { id: "nguyen6", when: { minWeek: 13, maxWeek: 15, flag: "graceBorn" }, title: "Three A.M. Theology",
        text: "Daniel answers the door holding Grace and a cold coffee. “Real question, Pastor. Is God awake at three in the morning? Because I am, every night, and I’ve been talking to Him a lot.”",
        choices: [
          { label: "Hold Grace while they nap", fx: { nguyen: -25, strength: -6, sermon: -3 },
            reply: "You walk Grace around the kitchen for an hour humming “Beautiful Savior.” Both parents sleep sitting up on the couch. The most useful hour of your week." },
          { label: "Read him Psalm 121", fx: { nguyen: -15, sermon: 3 },
            reply: "“He that keepeth Israel shall neither slumber nor sleep” (Psalm 121:4). Daniel laughs, tired. “So that’s who’s been up with me.” Yes. Exactly who." },
          { label: "Organize a meal train", fx: { nguyen: -18, harmony: 6, strength: -3 },
            reply: "In a day the sheet is full: hotdish, lasagna, Deb’s pie and four separate pans of bars. Linh says they won’t need to cook until Grace is in high school." }
        ] },

      { id: "nguyen7", when: { minWeek: 15, maxWeek: 17, flag: "graceBorn" }, title: "Settling In",
        text: "Linh irons for the altar guild now (Marge says “almost acceptably”), and Daniel is on council, where Pete finally has someone who understands pivot tables. Grace has two teeth.",
        choices: [
          { label: "Thank them for staying", fx: { nguyen: -15, harmony: 4 },
            reply: "“Where else would we go?” Linh says. “This is where Grace was baptized.” She says it like an address. In a way, it is." },
          { label: "Ask Daniel to help with youth", fx: { nguyen: -8, harmony: 6, strength: 2 },
            reply: "Daniel plans a lesson on Creation with a baking-soda volcano. Josh signs up at once. Marge asks that nothing be set on fire. No promises." }
        ] }
    ],

    walt: [
      { id: "walt1", when: { minWeek: 0, maxWeek: 2 }, title: "Eleven Casserole Dishes",
        text: "Walt Peterson’s counter holds eleven clean casserole dishes, each with a church member’s name on masking tape. Ruth died in October. Her reading glasses are still on the windowsill.",
        choices: [
          { label: "Help him return the dishes", fx: { walt: -15, harmony: 4, strength: -4 },
            reply: "You drive him around town returning dishes. At every door someone hugs him. By the last house Walt almost smiles. “Ruth would’ve made me bring cookies.”" },
          { label: "Just sit and have coffee", fx: { walt: -20, sermon: -2 },
            reply: "Walt makes coffee the way Ruth did, too strong. You drink it. Neither of you says much. At the door he says, “Come again.” He means it." },
          { label: "Pray with him", fx: { walt: -12, sermon: 2 },
            reply: "He grips the table edge through the prayer. “Haven’t prayed since the funeral,” he says. “Couldn’t.” “That’s all right,” you say. “We’ve been praying for you.”" }
        ] },

      { id: "walt2", when: { minWeek: 2, maxWeek: 4 }, title: "Christmas Is Hard",
        text: "Walt says he’ll skip Christmas Eve. “Ruth sang the descant on “Silent Night” for forty years. I can’t sit there and not hear it.” He’s looking at her chair, not at you.",
        choices: [
          { label: "Invite him for Christmas dinner", fx: { walt: -25, family: -2, strength: -5 },
            reply: "Walt comes with a pie from Deb’s and a present for Bea. Bea makes him wear a paper crown. He keeps it on through dinner, and laughs twice." },
          { label: "Say it’s all right to stay home", fx: { walt: -12, strength: 2 },
            reply: "“The Lord comes to living rooms too,” you say. “Read Luke 2 by her chair.” On the 26th he tells you he did, out loud, and it helped." },
          { label: "Bring him a candle afterward", fx: { walt: -20, strength: -6, family: -4 },
            reply: "At 11:40 p.m. you knock, a lit candle from the service cupped in your hand. Walt opens the door in his robe, takes it, and can’t speak. He doesn’t have to." }
        ] },

      { id: "walt3", when: { minWeek: 4, maxWeek: 7 }, title: "Lime Jello and Carrots",
        text: "Today Walt wants to talk. He met Ruth at a church potluck in 1968. She’d brought a green jello salad with shredded carrots in it. “Worst thing I ever ate,” he says. “I married her.”",
        choices: [
          { label: "Ask for the whole story", fx: { walt: -25, strength: -4, sermon: -2 }, set: "waltRuth",
            reply: "The potluck, the wedding, two sons, forty years in the choir loft. He laughs and cries in one breath. “Blessed are they that mourn: for they shall be comforted” (Matthew 5:4)." },
          { label: "Ask for the jello recipe", fx: { walt: -18, harmony: 3 }, set: "waltRuth",
            reply: "Ruth’s recipe card, in her round hand: “Lime jello, carrots, a little pineapple, and faith.” Walt laughs so hard he has to sit down." }
        ] },

      { id: "walt4", when: { minWeek: 6, maxWeek: 9, flag: "waltRuth" }, title: "Angry at God",
        text: "Walt’s porch, late afternoon. “I’ve been mad at God since October,” he says, low. “Ruth prayed every day of her life and still got sick. I’m ashamed of it. Is that a sin, being this mad?”",
        choices: [
          { label: "Hear his confession", fx: { walt: -25, strength: -5 }, set: "waltHealing",
            reply: "He confesses it all. You put a hand on his head: “I forgive you all your sins in the name of the Father and of the Son and of the Holy Spirit.” Walt weeps, then breathes." },
          { label: "Read him a psalm of lament", fx: { walt: -20, sermon: 3 }, set: "waltHealing",
            reply: "“Why art thou cast down, O my soul?” (Psalm 42:5). “That’s in the Bible?” Walt asks. “God lets people say that?” He does. Walt reads it twice more." },
          { label: "Tell him God can take it", fx: { walt: -15, strength: -2 }, set: "waltHealing",
            reply: "“God can bear your anger, Walt. He bore the cross.” Walt is quiet a long while. “Ruth used to say that,” he says at last. “About me.”" }
        ] },

      { id: "walt5", when: { minWeek: 8, maxWeek: 10, flag: "waltHealing" }, title: "Humming",
        text: "You find Walt fixing his porch rail and humming, almost under his breath: “Abide with Me.” He stops when he sees you, embarrassed. “Ruth’s favorite. Hannah keeps calling.”",
        choices: [
          { label: "Ask him back to the choir", fx: { walt: -12, harmony: 3 }, set: "waltHumming",
            reply: "“The basses need you, Walt. There are two, and one is Gus.” Walt winces. “Gus sings like a boiler.” He doesn’t say yes. He doesn’t say no." },
          { label: "Hum along with him", fx: { walt: -20, strength: -2 }, set: "waltHumming",
            reply: "You hum the second verse, badly. Walt corrects your pitch without thinking, then laughs at himself. “Old habits.” He hums it all the way through." }
        ] },

      { id: "walt6", when: { minWeek: 10, maxWeek: 11, flag: "waltHumming" }, title: "Back in the Loft",
        text: "Choir rehearsal for Easter. The door opens. Walt Peterson, in his good cardigan, folder under his arm, takes his old chair in the bass section. Hannah plays her first wrong note in years.",
        choices: [
          { label: "Stand with him at rehearsal", fx: { walt: -20, strength: -3, sermon: -2 }, set: "waltSings",
            reply: "You sing bass beside him, terribly; he’s gracious about it. At Easter his voice comes in under “Jesus Christ Is Risen Today” like a floor you can stand on." },
          { label: "Let him slip in quietly", fx: { walt: -15, harmony: 5 }, set: "waltSings",
            reply: "You wave from the back and leave him to it. Hannah tells you later he wept through the Alleluias and never missed a note." }
        ] },

      { id: "walt6b", when: { minWeek: 12, maxWeek: 13, notFlag: "waltHumming" }, title: "The Back Pew",
        text: "Walt came to Easter. He sat in the back pew by the door and didn’t sing. But he came. On the steps he says, “Maybe next year, Pastor. Maybe the choir next year.”",
        choices: [
          { label: "“Next year, then”", fx: { walt: -12 },
            reply: "“The loft will keep,” you say. He shakes your hand and holds it a moment. It’s a start. Starts count." },
          { label: "Walk him home", fx: { walt: -18, strength: -4, family: -3 },
            reply: "Six blocks, slowly. At his gate he says, “She’d have liked the lilies.” Then: “Thanks for coming by all winter.” He goes in humming something." }
        ] },

      { id: "walt7", when: { minWeek: 12, maxWeek: 15, flag: "waltSings" }, title: "Ruth’s Jello Salad",
        text: "Walt plans to bring Ruth’s green jello salad to the spring potluck, carrots and all. “Somebody has to,” he says. “Tradition.” He has made it four times to get it right.",
        choices: [
          { label: "Taste-test it", fx: { walt: -18, strength: -3 },
            reply: "It is exactly as bad as promised. You eat a whole helping. Walt watches your face and laughs until he has to take off his glasses. “That’s the stuff.”" },
          { label: "Tell him Ruth would be proud", fx: { walt: -15, harmony: 3 },
            reply: "“She’d be mad I used the good bowl,” Walt says. Then, quieter: “But yes.” At the potluck the bowl comes home empty. Love is strange that way." }
        ] },

      { id: "walt8", when: { minWeek: 16, maxWeek: 17 }, title: "Bulbs in October",
        text: "Walt is on his knees in Ruth’s garden planting tulip bulbs, the way she did every fall. “You plant for a spring you can’t see yet,” he says. “That’s faith, isn’t it?”",
        choices: [
          { label: "“Yes. That’s faith.”", fx: { walt: -15, sermon: 3 },
            reply: "You give him Paul’s word for it: “them also which sleep in Jesus will God bring with him” (1 Thessalonians 4:14). Walt nods and hands you a trowel." },
          { label: "Kneel and help him plant", fx: { walt: -18, strength: -5, family: -2 },
            reply: "An afternoon in Ruth’s garden. Walt tells you which bulbs came from which year. The oldest ones are from 1971. They still come up." }
        ] }
    ],

    josh: [
      { id: "josh1", when: { minWeek: 0, maxWeek: 3 }, title: "Back Row, Hood Up",
        text: "First catechism class after Thanksgiving break. Josh Kowalski, 14, sits in the back row with his hood up. “Is this mandatory,” he asks, not quite a question, “or optional, like gym?”",
        choices: [
          { label: "“Questions welcome. Any of them.”", fx: { josh: -15, sermon: -2 },
            reply: "“God isn’t scared of questions,” you say. Josh lowers his hood an inch. “Anything?” “Anything.” He looks like he’s starting a list." },
          { label: "Have him read the Creed aloud", fx: { josh: 5, harmony: 2 },
            reply: "He reads it in a flat, fast monotone. But at “the resurrection of the body” he slows, just slightly. You notice. You don’t say so." },
          { label: "Hot chocolate after class", fx: { josh: -20, strength: -3, family: -2 },
            reply: "At the café he orders Deb’s biggest hot chocolate and talks video games for forty minutes. Then, at the door: “Can I ask weird stuff in class?”" }
        ] },

      { id: "josh2", when: { minWeek: 3, maxWeek: 13 }, title: "Why Pray?",
        text: "Josh, arms crossed: “Weird question. If God knows everything already, why pray? It’s like texting someone a thing they already read.” The other confirmands look up, interested.",
        choices: [
          { label: "Because He’s our Father", fx: { josh: -20, sermon: 3 }, set: "joshQ1",
            reply: "“your Father knoweth what things ye have need of, before ye ask him” (Matthew 6:8). “Prayer isn’t news for God,” you say. “It’s a kid talking to a Father who wants to hear.”" },
          { label: "Ask what he’d pray about", fx: { josh: -22, strength: -4 }, set: "joshQ1",
            reply: "A long pause. “My parents fight a lot.” So you pray, right there, all of you, for the Kowalskis. Afterward Josh says, “Huh. That’s different from reading about it.”" },
          { label: "He told us to, and promised", fx: { josh: -14, sermon: 4 }, set: "joshQ1",
            reply: "“Jesus told us to pray and promised to hear,” you say. “We don’t pray because God’s missing information. We pray because He asked us to come close.”" }
        ] },

      { id: "josh3", when: { minWeek: 5, maxWeek: 13, flag: "joshQ1" }, title: "Is Grandma in Heaven?",
        text: "After class Josh waits until the others leave. “My Babcia died last spring. She brought me to church every week. Is she… is she in heaven? Like, actually?”",
        choices: [
          { label: "Give him Jesus’s promise", fx: { josh: -22, strength: -3 }, set: "joshQ2",
            reply: "Jesus’s own words: “I am the resurrection, and the life” (John 11:25). Babcia was baptized and trusted Christ; she’s with the Lord, and He will raise her. Josh nods hard." },
          { label: "Ask him about her", fx: { josh: -20, strength: -3, sermon: -2 }, set: "joshQ2",
            reply: "Her pierogi, her worn prayer book, the way she sang off-key on purpose to make him laugh. Then you tell him about the resurrection. He listens differently now." },
          { label: "Read 1 Thessalonians 4", fx: { josh: -16, sermon: 4 }, set: "joshQ2",
            reply: "“that ye sorrow not, even as others which have no hope” (1 Thessalonians 4:13). “So I can still be sad?” “Yes,” you say. “Just not hopeless.”" }
        ] },

      { id: "josh4", when: { minWeek: 7, maxWeek: 13, flag: "joshQ2" }, title: "Why Do We Need Church?",
        text: "“Real talk,” says Josh. “I can pray in my room. I can read the Bible on my phone. Why do I have to come here every Sunday and sit next to Gus?”",
        choices: [
          { label: "Because Christ comes here", fx: { josh: -20, sermon: 4 }, set: "joshQ3",
            reply: "“Here’s where Christ gives Himself: the Word, the water, the bread and wine. Your phone can’t put His body in your hand.” Josh thinks. “Okay. That’s a good answer.”" },
          { label: "Because you need Gus", fx: { josh: -18, harmony: 4 }, set: "joshQ3",
            reply: "“Not forsaking the assembling of ourselves together” (Hebrews 10:25). “You need Gus and Gus needs you. That’s the body of Christ.” Josh groans. Then laughs." },
          { label: "Take him on rounds", fx: { josh: -22, strength: -5 }, set: "joshQ3",
            reply: "At Pine Haven, Mrs. Dahl makes him read Psalm 23 to her and holds his hand the whole time. In the car Josh says, quietly, “Okay. I kind of get it now.”" }
        ] },

      { id: "josh5", when: { minWeek: 9, maxWeek: 14, flag: "joshQ3" }, title: "Help Thou Mine Unbelief",
        text: "Josh is supposed to pick a confirmation verse. “What if I’m not sure I believe enough? Some days I do. Some days I really don’t. Isn’t it lying to get confirmed?”",
        choices: [
          { label: "Show him Mark 9:24", fx: { josh: -25, sermon: 3 }, set: "joshReady",
            reply: "“Lord, I believe; help thou mine unbelief” (Mark 9:24). Josh reads it three times. “That’s allowed? In the Bible?” It’s allowed. He picks it for his verse." },
          { label: "Faith is God’s gift, not a score", fx: { josh: -20, strength: -2 }, set: "joshReady",
            reply: "“Confirmation isn’t you proving your faith. It’s confessing the faith God gave you at the font. He’s holding on to you, Josh, not the other way round.”" },
          { label: "Let him sleep on it", fx: { josh: -12, strength: 3 }, set: "joshReady",
            reply: "You send him home with “For by grace are ye saved through faith; and that not of yourselves: it is the gift of God” (Ephesians 2:8). Next class: “Okay. I’m in.”" }
        ] },

      { id: "josh5b", when: { minWeek: 13, maxWeek: 14, notFlag: "joshReady" }, title: "Not Yet",
        text: "At the café Josh stirs his hot chocolate without drinking it. “I don’t think I’m ready to be confirmed with the others,” he says. “Is that bad?”",
        choices: [
          { label: "“There’s no deadline with God”", fx: { josh: -10, harmony: -2 },
            reply: "“Your baptism already made you His,” you say. “We’ll keep talking.” Josh exhales like he’s been holding that breath since Christmas." },
          { label: "Offer to meet every week", fx: { josh: -15, strength: -5 },
            reply: "Tuesdays, the café, hot chocolate and questions. He says yes so fast he spills. Next year’s class will have one very well-prepared confirmand." }
        ] },

      { id: "josh6", when: { minWeek: 14, maxWeek: 17, flag: "joshReady" }, title: "Acolyte",
        text: "Newly confirmed, Josh asks to be an acolyte. His first Sunday he lights the candles with tremendous care, then nearly sets Marge’s paraments on fire putting them out.",
        choices: [
          { label: "Teach him the snuffer properly", fx: { josh: -15, harmony: 2, strength: -2 },
            reply: "Marge teaches him, actually, with a steely patience normally reserved for linens. By the next Sunday he’s flawless. She calls him “the Kowalski boy” with something like pride." },
          { label: "Laugh it off with him", fx: { josh: -18, marge: 6 },
            reply: "You both laugh in the sacristy until your eyes water. Marge does not laugh. She does buy a fire extinguisher for the sacristy and labels it JOSH." }
        ] },

      { id: "josh7", when: { minWeek: 15, maxWeek: 17 }, title: "Here I Stand",
        text: "Josh has been reading about Luther on his own. “So Luther asked questions, got in huge trouble, and was right?” He looks extremely pleased. “So asking questions is basically Lutheran.”",
        choices: [
          { label: "Tell him where Luther landed", fx: { josh: -15, sermon: 4 },
            reply: "Luther’s questions led him to one answer, you tell him: a man is “justified by faith without the deeds of the law” (Romans 3:28). Josh writes it on his hand." },
          { label: "Recruit him for Reformation", fx: { josh: -18, strength: -3, harmony: 3 },
            reply: "He makes a giant paper copy of the 95 Theses and tapes it to the narthex door with fierce precision. It covers the exit sign. Gus moves it six inches. Compromise." }
        ] }
    ],

    pete: [
      { id: "pete1", when: { minWeek: 0, maxWeek: 2 }, title: "Fourteen Tabs",
        text: "Pete Hansen turns his laptop toward you: a budget spreadsheet with fourteen color-coded tabs. “We’re eleven thousand behind for the year, Pastor. I haven’t slept since Reformation Sunday.”",
        choices: [
          { label: "Go through it line by line", fx: { pete: -15, building: 6, strength: -5, sermon: -3 },
            reply: "Two hours, fourteen tabs. You find $1,200 in a line labelled MISC (???). Pete nearly weeps. “The snow-removal deposit,” he whispers. “I forgot I paid it.”" },
          { label: "Pray with him first", fx: { pete: -20, strength: -2 },
            reply: "“Casting all your care upon him; for he careth for you” (1 Peter 5:7). Pete’s shoulders drop an inch. “Can I cast the spreadsheet on him too?” Especially the spreadsheet." },
          { label: "Tell him to get some sleep", fx: { pete: -8, strength: 2, building: -2 },
            reply: "“St. Luke’s survived 1981, Pete. It’ll survive December.” He laughs a little. He also emails you at 2:14 a.m. with a new tab." }
        ] },

      { id: "pete2", when: { minWeek: 1, maxWeek: 4, flag: "boilerDead" }, title: "What a Boiler Costs",
        text: "Pete has the quote: $38,400 installed. He says the number three times, each time quieter. “We have $6,200 in the property fund. Pastor, I need to sit down. I am sitting down.”",
        choices: [
          { label: "Draft a special appeal", fx: { pete: -10, building: 8, harmony: -3 },
            reply: "An honest letter, short, no guilt: “Old Faithful served sixty-four years. Help us keep the doors warm.” Pete adds a chart. Of course he does." },
          { label: "Ask the district for a loan", fx: { pete: 6, building: 12 },
            reply: "The Church Extension Fund will lend at low interest, if the voters approve it. They do. Pete now has a loan to worry about, and a new tab called LOAN (BREATHE)." },
          { label: "“One day at a time, Pete”", fx: { pete: -18, building: 2 },
            reply: "“Take therefore no thought for the morrow” (Matthew 6:34). “That’s not a budget strategy,” says Pete. “No,” you agree. “It’s a Pete strategy.” He almost smiles." }
        ] },

      { id: "pete3", when: { minWeek: 4, maxWeek: 7 }, title: "Stewardship Sunday",
        text: "Pete wants a stewardship sermon and has made a giant thermometer poster to go with it. “Something motivating, Pastor. Maybe mention the boiler. Maybe mention it a lot.”",
        choices: [
          { label: "Preach grace, not guilt", fx: { pete: -10, sermon: 6, building: 4 },
            reply: "You preach God’s giving first: the Son, the cross, daily bread. Our giving is thanks, never a fee. “God loveth a cheerful giver” (2 Corinthians 9:7). Pledges come in." },
          { label: "Let Pete give a temple talk", fx: { pete: -18, harmony: 5, strength: 2 },
            reply: "Pete talks for three minutes: “I give because I’ve been given so much, and I worry too much, and giving helps with both.” Best stewardship talk in years." },
          { label: "Put up the thermometer", fx: { pete: -12, building: 8, harmony: -4 },
            reply: "The thermometer goes up in the narthex and the red line climbs. So does Marge’s blood pressure: she says it looks “like a telethon.” It works, though." }
        ] },

      { id: "pete4", when: { minWeek: 8, maxWeek: 10 }, title: "One Canadian Quarter",
        text: "Pete brings the boiler fund totals: $31,412.04 “and one Canadian quarter. There’s no column for Canada.” You’re $7,000 short, and the installer wants an answer by Friday.",
        choices: [
          { label: "Call a special voters’ meeting", fx: { pete: 8, building: 10, strength: -3 },
            reply: "Sunday, after church, coffee in hand: the voters say yes, 41 to 3. Pete makes a new tab: FAITH (TEMPORARY). The quarter goes in the coffee jar." },
          { label: "Wait and keep saving", fx: { pete: -10, building: -4, harmony: -3 },
            reply: "Pete is relieved. The sanctuary stays cold three more weeks. Marge says it builds character. Gus says it builds pneumonia." },
          { label: "Make a column for Canada", fx: { pete: -15, strength: -2 },
            reply: "You sit with Pete and make a column for Canada. It’s the first time you’ve seen him laugh. A small laugh. A coin-sized laugh. It counts." }
        ] },

      { id: "pete5", when: { minWeek: 10, maxWeek: 12 }, title: "The Envelope",
        text: "In the offering plate: a cashier’s check for $7,000, no name, and a note: “For the boiler. Psalm 127:1.” Pete is beside himself. “We have to thank them! Who was it? I need to know.”",
        choices: [
          { label: "Let the giver stay hidden", fx: { pete: -12, building: 10, harmony: 3 },
            reply: "“when thou doest alms, let not thy left hand know what thy right hand doeth” (Matthew 6:3). “Terrible accounting,” Pete groans, and files it under GOD KNOWS." },
          { label: "Give thanks for it on Sunday", fx: { pete: -18, building: 10, strength: -2 },
            reply: "You thank God for it in the prayers, no names. Afterward three different people look very innocent. Pete watches all of them like a detective." }
        ] },

      { id: "pete6", when: { minWeek: 13, maxWeek: 15 }, title: "Pete Laughs",
        text: "Council meeting. Biscuit strolls across Pete’s laptop, deletes a formula, and sits on the keyboard. A cell fills with 8s. Pete stares. Everyone waits for the explosion.",
        choices: [
          { label: "Laugh first", fx: { pete: -20, harmony: 6 },
            reply: "You laugh. Pete stares at you, then at the cat, and then he laughs too, till he takes off his glasses. “A merry heart doeth good like a medicine” (Proverbs 17:22)." },
          { label: "Help him fix the formula", fx: { pete: -10, building: 5, strength: -3 },
            reply: "You fix it cell by cell. “Last year I’d have cried,” Pete says. “And this year?” He scratches Biscuit’s ears. “This year I want to see what she types next.”" }
        ] },

      { id: "pete7", when: { minWeek: 15, maxWeek: 17 }, title: "A New Tab",
        text: "Pete shows you a new tab in the budget. It’s called THANKS. It lists everything that went right this year: the boiler, the pancakes, a baby named Grace, one Canadian quarter.",
        choices: [
          { label: "Ask him to read it at council", fx: { pete: -15, harmony: 6, strength: -2 },
            reply: "He reads all forty-one lines. Gus blows his nose. Marge says, “Well.” It’s the first council meeting in memory to end early." },
          { label: "Add a line of your own", fx: { pete: -18, sermon: 3 },
            reply: "You type: “Pete Hansen, who worried for all of us.” He reads it twice and says nothing. He doesn’t delete it, either." }
        ] }
    ],

    hannah: [
      { id: "hannah1", when: { minWeek: 0, maxWeek: 2 }, title: "The Cantata",
        text: "Hannah Ruiz has planned a forty-minute Christmas cantata for a choir of nine, a children’s handbell choir and a recorder solo. “It’s ambitious,” she admits, “but so was the Incarnation.”",
        choices: [
          { label: "Cheer her on", fx: { hannah: -15, harmony: 3, strength: -3 },
            reply: "Hannah glows. Then she hands you a schedule: nineteen rehearsals, some at 6 a.m. “For the dedicated,” she says. You are, apparently, dedicated." },
          { label: "Suggest trimming it", fx: { hannah: 6, sermon: 3, strength: 2 },
            reply: "“Trim it?” She looks at you as if you’d suggested trimming the Magnificat. She cuts one verse of one carol “as a gesture.” Still forty minutes." },
          { label: "Offer to run rehearsal coffee", fx: { hannah: -20, family: -4, strength: -2 },
            reply: "You master the urn and its forty-cup moods. Hannah calls you “the best rehearsal assistant I’ve ever had.” You’ve been promoted. There is no pay." }
        ] },

      { id: "hannah2", when: { minWeek: 2, maxWeek: 4 }, title: "Dress Rehearsal",
        text: "Both tenors have colds, the handbells are playing “Silent Night” at three different speeds, and the recorder soloist has lost her recorder. Hannah is very calm. Too calm.",
        choices: [
          { label: "Sing tenor yourself", fx: { hannah: -20, strength: -5, sermon: -3 },
            reply: "You are not a tenor. You are barely a baritone. But you hold the line, and Hannah mouths “thank you” with real tears. The recorder turns up in the coat rack." },
          { label: "Pray with the choir", fx: { hannah: -15, harmony: 5 },
            reply: "A circle, bells and all. You pray for voices, nerves and lost recorders. By the Amen Hannah is laughing. The bells still disagree, but more cheerfully." },
          { label: "Send everyone home early", fx: { hannah: 8, strength: 4, harmony: 2 },
            reply: "“Sleep is also a spiritual discipline,” you say. Hannah looks betrayed. Next day both tenors can sing. She admits nothing, but brings you a muffin." }
        ] },

      { id: "hannah3", when: { minWeek: 4, maxWeek: 6 }, title: "Every Wrong Note",
        text: "The cantata is over. People cried. A child sang “Away in a Manger” in the wrong key and the whole church sang along anyway. Hannah remembers only the four wrong notes in the bells.",
        choices: [
          { label: "Remind her who it was for", fx: { hannah: -20, sermon: 2 },
            reply: "“And the shepherds returned, glorifying and praising God” (Luke 2:20). “For the Baby,” you say, “not the bells.” She sniffs. “The bells were for the Baby too.” Yes. Wrong notes and all." },
          { label: "Bring her the thank-you notes", fx: { hannah: -15, harmony: 3 },
            reply: "A stack of notes from the congregation. One, in crayon, says “The bells were the best part.” Hannah puts that one in her purse." },
          { label: "Let her vent over pie", fx: { hannah: -18, strength: -3, family: -2 },
            reply: "At the café Hannah lists every mistake with measure numbers. Then she eats a whole slice of French silk and says, “It was pretty good, wasn’t it?” It was." }
        ] },

      { id: "hannah4", when: { minWeek: 6, maxWeek: 9 }, title: "Brass for Easter",
        text: "“Praise him with the sound of the trumpet” (Psalm 150:3), Hannah reminds you. She has found an Easter brass quintet. She has not told Pete what they cost.",
        choices: [
          { label: "Approve the brass", fx: { hannah: -20, building: -8, pete: 6 },
            reply: "Hannah hugs you, which she has never done. Pete hears the price and lies down on the fellowship hall floor for a while. It will be a very loud Easter." },
          { label: "Ask the high school band", fx: { hannah: -10, harmony: 5, building: -2 },
            reply: "Three kids from the high school band say yes, including a sophomore tuba player named Kyle. Hannah is skeptical. Kyle is magnificent." },
          { label: "Talk to Pete first", fx: { hannah: 6, pete: -6, building: 2 },
            reply: "Pete is grateful to be asked; Hannah is less grateful to wait. It works out, after a meeting longer than the Passion reading." }
        ] },

      { id: "hannah5", when: { minWeek: 8, maxWeek: 10 }, title: "A Small Request",
        text: "Hannah, very casually: “At Easter sunrise I’d love you to sing the first verse of “Jesus Christ Is Risen Today” alone, before the brass.” You have heard yourself sing. So has she.",
        choices: [
          { label: "Agree. Heaven help us.", fx: { hannah: -20, strength: -3 }, set: "pastorSolo",
            reply: "“Make a joyful noise unto the LORD” (Psalm 100:1), you remind her. “Noise is the word,” she says, and books eleven rehearsals." },
          { label: "Offer a duet with Bea", fx: { hannah: -12, family: 6 }, set: "pastorSolo",
            reply: "Bea is thrilled. Hannah is relieved. Bea will carry the tune and you will stand near it, supportively. “Like a fence post,” Hannah says kindly." },
          { label: "Decline, gracefully", fx: { hannah: 6, sermon: 3 },
            reply: "“The congregation deserves better,” you say. Hannah argues less than you’d hoped. Then she says Walt’s name, thoughtfully. Interesting." }
        ] },

      { id: "hannah6", when: { minWeek: 9, maxWeek: 11, flag: "pastorSolo" }, title: "Solo Rehearsal",
        text: "Rehearsal number four. Hannah plays your note. You sing a note. They are not the same note. “Again,” she says gently, the way you’d talk to a horse that’s afraid of bridges.",
        choices: [
          { label: "Practice every day this week", fx: { hannah: -18, strength: -5, sermon: -4 },
            reply: "You practice in the car, the shower, the hospital parking lot. Nurse Carol applauds once, uncertainly. It’s getting better. Mostly." },
          { label: "Laugh and sing it anyway", fx: { hannah: -12, strength: 2 },
            reply: "You laugh, she laughs, and you sing it with your whole chest, wrong and glad. “Well,” Hannah says, “nobody will doubt it’s sincere.” That’s what Easter’s for." }
        ] },

      { id: "hannah7", when: { minWeek: 12, maxWeek: 14 }, title: "After the Alleluias",
        text: "After Easter, Hannah sits on the organ bench without playing, which you’ve never seen. “I planned every note of Lent and Easter,” she says. “I’m so tired I can’t hear music anymore.”",
        choices: [
          { label: "Read her Luke 10", fx: { hannah: -20, sermon: 2 },
            reply: "“Martha, Martha, thou art careful and troubled about many things” (Luke 10:41). Hannah laughs. “Did Jesus just call me out?” Kindly. She takes a week off." },
          { label: "Promise simple summer hymns", fx: { hannah: -15, harmony: 3, strength: -3 },
            reply: "“Beautiful Savior,” “Abide with Me,” no anthems till fall. Hannah exhales like a balloon. “Can we still do descants?” One descant. Maybe two." },
          { label: "Find a substitute organist", fx: { hannah: -18, building: -5 },
            reply: "A retired organist from Mankato fills in for two Sundays. Hannah sits in a pew for the first time in nine years and sings with everyone. “Disorienting and lovely,” she says." }
        ] },

      { id: "hannah8", when: { minWeek: 15, maxWeek: 17 }, title: "A Mighty Fortress",
      text: "Reformation is coming. Hannah wants “A Mighty Fortress” in the stately, even rhythm, “like Bach.” Gus wants the bouncy one “we’ve sung since 1941.” Both have brought sheet music. Both are looking at you.",
      choices: [
        { label: "The bouncy one", fx: { hannah: -6, gus: -12, harmony: 2 },
          reply: "Verse one, the whole church bounces. By verse four Gus is tapping his foot and Hannah is, against her will, smiling. Luther would have approved, loudly." },
        { label: "Hannah’s stately one", fx: { hannah: -18, gus: 4, harmony: -2 },
          reply: "It rolls out of the organ like a fortress should. Gus sings it anyway, bouncily, half a beat ahead of everyone. It is a kind of harmony." },
        { label: "Two verses each way", fx: { hannah: -12, gus: -8, harmony: 4 },
          reply: "Hannah calls it “very Lutheran: both/and.” You’re not sure that’s what Lutheran means, but you’ll take it." }
      ] }
    ]
  },

  // Generic visit lines when no story scene applies (same shape as pool entries).
  visitLines: {
    olsen: [
      { text: "Mrs. Olsen beats you at cribbage and is gracious about it. Barely." },
      { text: "She shows you her African violets, each with a name. The purple one is called Martin Luther." },
      { text: "She quizzes you on the Third Article of the Creed. You pass. She seems slightly disappointed." },
      { text: "Tea, lefse and twenty minutes of news about people you’ve never met but now feel you know." },
      { text: "She reads you a letter from a 1964 Sunday school student, now a grandmother in Oregon. “They grow up,” she says. “Then they write.”" },
      { text: "You pray together through her prayer list. Her list is longer than yours." }
    ],
    gus: [
      { text: "Gus shows you a gasket. You admire the gasket. This is the relationship." },
      { text: "Gus is in the boiler room talking softly. When you come in he pretends he was on the phone." },
      { text: "Gus fixes the squeaky pew in four minutes flat and refuses to be thanked." },
      { text: "At the café Gus orders “the usual,” which is coffee and an opinion about the weather." },
      { text: "Gus asks if you’ve noticed the gutters. You have not. You will now." }
    ],
    marge: [
      { text: "Marge is polishing the brass candlesticks and humming. When she sees you she stops humming but keeps polishing." },
      { text: "Marge hands you a lint roller before you’ve said hello. You use it." },
      { text: "Marge walks you through the altar guild schedule for the next six months. You did not ask." },
      { text: "Marge checks the thermostat on her way past you and nods, like a sentry." },
      { text: "Over coffee Marge confides she’s never liked the green paraments. “Too cheerful,” she says." }
    ],
    nguyen: [
      { text: "Daniel tells you a chemistry joke. You don’t get it. He explains. You still don’t, but you laugh because he’s so pleased." },
      { text: "Linh feeds you something delicious and won’t say what’s in it until you’ve had seconds." },
      { text: "The Nguyens ask what “hotdish” really means. You try to explain. You fail. Nobody can." },
      { text: "Linh asks you to bless the house. You go room to room with a short prayer. In the kitchen she points at the stove: “Extra for this one.”" },
      { text: "You compare Willow Creek winters with Houston summers and agree that God made both and loves the people in them anyway." }
    ],
    walt: [
      { text: "Walt makes the coffee too strong, the way Ruth did. You drink it." },
      { text: "You and Walt watch Ruth’s bird feeder. He knows every bird by name, and some by personality." },
      { text: "Walt shows you his woodshop. A birdhouse for somebody’s grandchild. “Keeps the hands busy,” he says." },
      { text: "At the café Walt asks for “Ruth’s booth.” Deb has been saving it." },
      { text: "Walt tells you a joke Ruth used to tell badly, on purpose. You laugh. So does he." }
    ],
    josh: [
      { text: "Josh asks whether Jonah’s fish was really a whale. Twenty minutes on fish. Somehow it counts as catechism." },
      { text: "Josh shows you a video of a cat falling off a piano. You both watch it four times." },
      { text: "Josh has memorized the Ten Commandments to win a bet with his cousin. He recites them at speed. All correct." },
      { text: "Over hot chocolate Josh asks what you actually do all week. You tell him. He looks surprised and slightly impressed." },
      { text: "Josh asks a Trinity question you answer, then a follow-up you can’t. You promise to read up. He looks delighted to have stumped you." }
    ],
    pete: [
      { text: "Pete shows you a new chart. It goes up and to the right. He isn’t sure whether to be happy about it." },
      { text: "Pete asks if you’ve seen the latest utility bill. You haven’t. He tells you anyway, in detail." },
      { text: "At the café Pete orders decaf, then worries the decaf has caffeine." },
      { text: "Pete wants to talk about the endowment fund: $2,140 and one savings bond from 1977." },
      { text: "Pete tells you, almost shyly, that he now reads a psalm before he opens the spreadsheet. It helps." }
    ],
    hannah: [
      { text: "Hannah plays the postlude for the eleventh time. It’s perfect. She frowns and starts over." },
      { text: "Hannah shows you her hymn plans for six weeks, cross-referenced to the readings. They are better than your sermon plans." },
      { text: "Hannah asks if you could sing a little louder in the liturgy. Then a little softer." },
      { text: "Hannah lets you sit on the organ bench while she plays “Beautiful Savior.” The whole floor hums." },
      { text: "Hannah needs a recorder soloist for next year. She looks at you. You leave quickly." }
    ]
  },

  // ───────────────────────── 3. Events ─────────────────────────
  events: [
    // Fixed points an LCMS pastor would miss: elders, the circuit winkel,
    // and (since HIPAA) finding out about hospital stays second-hand.
    { id: "elders", when: { minWeek: 6, maxWeek: 6, day: 3, chance: 1 }, from: "Erv Lindemann", kind: "call", title: "Elders’ Meeting",
      text: "Erv, head elder: “Elders tonight. Who’s missing from church, who’s in the hospital, who needs you. I’ve made a list. It’s long.”",
      choices: [
        { label: "Divide up the calls", fx: { walt: -8, olsen: -8, harmony: 3, strength: -4 },
          reply: "Erv takes the Peterson visits, Arne takes the young families, you take the hard ones. They also ask how YOU are, which nobody else has this month." },
        { label: "Pray through the directory", fx: { harmony: 4, sermon: 3, strength: -2 },
          reply: "Name by name, A to Z. It takes ninety minutes. By the Zimmermans, everyone is quieter and kinder. Erv puts the list away for next month." }
      ] },

    { id: "winkel", when: { minWeek: 3, maxWeek: 3, day: 3, chance: 1 }, from: "Circuit visitor", kind: "email", title: "Winkel at Trinity",
      text: "This month’s winkel is at Trinity in Elm Grove: the Divine Service, a paper on Romans 6, and the circuit’s seven pastors over ham sandwiches.",
      choices: [
        { label: "Go, and mostly listen", fx: { strength: 8, sermon: 8 },
          reply: "“We are buried with him by baptism into death” (Romans 6:4). You leave with three sermon ideas and the reassurance that everyone else’s copier is broken too." },
        { label: "Bring the boiler question", fx: { strength: 6, building: 3 },
          reply: "Every pastor in the circuit has a boiler story. Pastor Schmidt’s involves a fire truck. You drive home feeling, by comparison, blessed." }
      ] },

    { id: "winkelSpring", when: { minWeek: 14, maxWeek: 14, day: 2, chance: 1 }, from: "Circuit visitor", kind: "email", title: "Spring Winkel",
      text: "Winkel at St. Paul’s, Dover: a case study (“What would you do?”), the Divine Service, and the annual argument about hymn tempos.",
      choices: [
        { label: "Present your hard case", fx: { strength: 8, sermon: 5, harmony: 2 },
          reply: "Names changed, details blurred, the question honest. Six pastors think it through with you. You drive home lighter. That is what brothers are for." },
        { label: "Take the tempo side", fx: { strength: 5, hannah: -6 },
          reply: "You defend Hannah’s tempos with conviction. Pastor Meyer defends his organist’s. Nobody wins. Everyone enjoys it enormously." }
      ] },

    { id: "nobodyTold", when: { minWeek: 2, maxWeek: 16, chance: 0.2 }, from: "Pete", kind: "call", title: "Nobody Called",
      text: "Pete, offhand: “Did you hear Arne’s in the hospital? Three days now. Gallbladder.” Nobody called the office. Since the privacy laws, the hospital can’t.",
      choices: [
        { label: "Go this afternoon", fx: { harmony: 4, strength: -6, sermon: -2 },
          reply: "Arne is delighted and slightly guilty. “Didn’t want to bother you.” You tell him that being bothered is the job. Then you pray with him." },
        { label: "Put a note in the bulletin", fx: { harmony: 2, building: 2 },
          reply: "“If you or someone you love is in the hospital, please tell the church office. We can’t know unless you tell us.” You visit Arne on the way home." }
      ] },
    // Fixed beats (chance 1, one week, one day)
    { id: "boiler", when: { minWeek: 1, maxWeek: 1, day: 0, chance: 1 }, from: "Gus", kind: "call", title: "Old Faithful",
      text: "Gus, at 6 a.m., very quiet: “She’s gone, Pastor. Made a sound like a sigh and went cold. Sixty-four years.” The sanctuary is already 51 degrees.",
      choices: [
        { label: "Space heaters and blankets", fx: { building: -4, harmony: 3, strength: -3 }, set: "boilerDead",
          reply: "By noon the fellowship hall holds nine space heaters and every quilt the quilting circle owns. It looks like a very holy campsite." },
        { label: "Rent a temporary heater", fx: { building: -12, harmony: 6 }, set: "boilerDead",
          reply: "A rented heater the size of a minivan arrives on a trailer and roars like a jet. Pete watches the invoice the way some people watch horror movies." },
        { label: "Worship in the fellowship hall", fx: { building: 2, harmony: -4, sermon: 3 }, set: "boilerDead",
          reply: "Folding chairs, a portable altar, Marge’s best linens. Some grumble. Some say it’s the coziest church they’ve ever been in." }
      ] },

    { id: "gaudete", when: { minWeek: 2, maxWeek: 2, day: 1, chance: 1 }, from: "Marge", kind: "call", title: "The Pink Candle",
      text: "Marge: “It’s Gaudete Sunday, so the rose candle goes on the wreath. Pete says it’s pink. It is ROSE, Pastor. Would you please tell him.”",
      choices: [
        { label: "Rule for rose", fx: { marge: -8, pete: 4 },
          reply: "You rule for rose. Pete says it’s still pink. Bea says it’s “salmon,” and both of them are horrified. “Rejoice in the Lord alway” (Philippians 4:4)." },
        { label: "Preach on joy, not color", fx: { sermon: 4, harmony: 2 },
          reply: "Gaudete means “rejoice,” you remind them both. You put it in the sermon. Pete and Marge each assume you meant the other one." }
      ] },

    { id: "copier", when: { minWeek: 3, maxWeek: 3, day: 0, chance: 1 }, from: "Hannah", kind: "call", title: "The Copier Strikes",
      text: "Hannah: “The copier ate the Christmas Eve bulletins. All three hundred. It’s making a noise like a goose.”",
      choices: [
        { label: "Fix it yourself, again", fx: { sermon: -5, building: 3, strength: -3 },
          reply: "Forty minutes, a butter knife and a prayer. The copier coughs out a bulletin with a toner smudge shaped like a star. You decide it’s a sign." },
        { label: "Use the library’s copier", fx: { strength: -4, building: -2, harmony: 2 },
          reply: "The library charges ten cents a page. The librarian, a Methodist, waves it off. “Merry Christmas, neighbor.”" },
        { label: "Print fewer; people can share", fx: { harmony: -3, building: 2, sermon: 2 },
          reply: "Families share. Couples share. Two men who haven’t spoken since a 2019 zoning dispute share. Christmas is like that." }
      ] },

    { id: "sheep", when: { minWeek: 3, maxWeek: 3, day: 2, chance: 1 }, from: "Sam", kind: "call", title: "Six Sheep, Five Costumes",
      text: "The pageant needs six sheep and has five costumes. The sixth sheep is Bea, who has been told she can be “a very fluffy shepherd.” Sam reports that Bea is not having it.",
      choices: [
        { label: "Make a costume tonight", fx: { family: 6, strength: -5, sermon: -3 },
          reply: "A white hoodie, four bags of cotton balls and two felt ears. Bea is the fluffiest sheep in Willow Creek. She bleats through the whole Gospel." },
        { label: "Ask Marge’s sewing circle", fx: { harmony: 4, marge: -6, family: 2 },
          reply: "By Saturday there are six sheep, a donkey, two sequined angels and a camel nobody asked for. Marge pretends the camel was the plan." },
        { label: "Fluffy shepherds are great", fx: { family: -4, sermon: 2 },
          reply: "Bea is a fluffy shepherd, under protest. During the pageant she quietly baas anyway. The congregation pretends not to notice. Everyone notices." }
      ] },

    { id: "olsenFall", when: { minWeek: 5, maxWeek: 5, day: 0, chance: 1 }, from: "Karen Olsen", kind: "call", title: "Mrs. Olsen Fell",
      text: "Karen, Mrs. Olsen’s daughter: “Mom’s at the hospital. She fell reaching for her lefse griddle. Broken hip, surgery this afternoon. She said to tell you, quote, ‘not to make a fuss.’”",
      choices: [
        { label: "Go before the surgery", fx: { olsen: -15, strength: -4, sermon: -4 }, set: "olsenHospital",
          reply: "You pray with her on the gurney. “Make it short,” she says. “They’re about to give me the good medicine.” Surgery goes well. Her first word after is “Lefse?”" },
        { label: "Pray now, visit tomorrow", fx: { olsen: -5, sermon: 3 }, set: "olsenHospital",
          reply: "Karen holds the phone to her mother’s ear while you pray. “Fine, fine. Amen,” says Mrs. Olsen. “Bring a crossword tomorrow.”" }
      ] },

    { id: "alleluia", when: { minWeek: 7, maxWeek: 7, day: 4, chance: 1 }, from: "Bea", kind: "knock", title: "Farewell to Alleluia",
      text: "Tomorrow is Transfiguration, the last Alleluia until Easter. Bea’s Sunday school class has made a paper ALLELUIA banner to bury in a shoebox, and she would like you to do the funeral. Properly.",
      choices: [
        { label: "Bury it with full honors", fx: { family: 8, harmony: 3, strength: -2 },
          reply: "A shoebox under the church sign, six children in mittens, one very solemn pastor. “His face did shine as the sun” (Matthew 17:2). See you at Easter, Alleluia." },
        { label: "Hide it in the sacristy", fx: { family: 5, sermon: 2 },
          reply: "The ground is frozen, so the Alleluia goes behind the vestments until Easter morning. Bea makes you promise to let her dig it out. You promise." }
      ] },

    { id: "snowDay", when: { minWeek: 6, maxWeek: 6, day: 1, chance: 1 }, from: "Gus", kind: "call", title: "Fourteen Inches",
      text: "Fourteen inches overnight. Gus calls at six: “Steps are buried, Pastor. Lot’s buried. My truck’s buried. I’m buried, emotionally.”",
      choices: [
        { label: "Shovel the steps yourself", fx: { building: 5, strength: -8 },
          reply: "Two hours, one shovel, one Bea with a beach pail. “He giveth snow like wool” (Psalm 147:16). By nine the steps are clear and you can feel muscles last used in seminary." },
        { label: "Cancel Bible study, go sledding", fx: { family: 10, building: -3, sermon: -2 },
          reply: "Bible study is off; the sledding hill is not. Bea goes down forty times. You go down twice and feel every one of your years." },
        { label: "Write at the kitchen table", fx: { sermon: 6, family: 3 },
          reply: "Snow at the window, soup on the stove, sermon on the table. Bea draws snowflakes in your margins. It’s the best draft you’ve written all winter." }
      ] },

    { id: "beaPlay", when: { minWeek: 7, maxWeek: 7, day: 3, chance: 1 }, from: "Sam", kind: "call", title: "Bea Is the Moon",
      text: "Sam: “Bea’s school play is tonight at six. She’s the Moon. She has one line and has practiced it two hundred times. Council is also at six.”",
      choices: [
        { label: "Go see the Moon", fx: { family: 12, harmony: -4 },
          reply: "Her line: “I shine because the sun shines on me.” She delivers it straight at you, and waves. You’ll preach it someday. Council survives without you." },
        { label: "Council; watch the video later", fx: { family: -8, building: 5, harmony: 3 },
          reply: "Sam’s video is mostly the back of a grandpa’s head, but you can hear her line, loud and proud. At bedtime she says it again, just for you." }
      ] },

    { id: "ashes", when: { minWeek: 8, maxWeek: 8, day: 0, chance: 1 }, from: "Marge", kind: "call", title: "Burning the Palms",
      text: "Marge: “Pastor, I was burning last year’s palms for the ashes and the smoke alarm went off, and the fire department is here, and they would like to speak to whoever is in charge.”",
      choices: [
        { label: "Go talk to the firefighters", fx: { harmony: 4, strength: -3, sermon: -3 },
          reply: "Three volunteer firefighters, two of them members. The third, a Catholic, asks if he can get ashes too. Yes. Of course. Come Wednesday." },
        { label: "Coffee can, outside, Marge", fx: { harmony: -2, building: 2, sermon: 2 },
          reply: "Marge burns the palms in a coffee can in the parking lot, muttering. The ashes are perfect. Gus says the lot smells like a holy barbecue." }
      ] },

    { id: "labor", when: { minWeek: 9, maxWeek: 9, day: 1, chance: 1 }, from: "Daniel Nguyen", kind: "call", title: "It’s Time",
      text: "5:12 a.m. Daniel, very fast: “Pastor? It’s Daniel. It’s happening. We’re at the hospital. Linh says don’t come yet. I’m calling anyway. Is that okay? I’m going to hang up now.”",
      choices: [
        { label: "Pray with him right now", fx: { nguyen: -10, strength: -2 }, set: "inLabor",
          reply: "You pray, short and steady: for Linh, for Daniel, for the baby, for the nurses. Daniel breathes for the first time in the call. “Okay,” he says. “Okay.”" },
        { label: "“Call me when she’s here”", fx: { nguyen: -6, strength: 2 }, set: "inLabor",
          reply: "“Or before, if you need me. I’m awake.” You aren’t, quite. You put the coffee on anyway, and pray while it brews." }
      ] },

    { id: "donkey", when: { minWeek: 10, maxWeek: 10, day: 0, chance: 1 }, from: "Arne Schroeder", kind: "call", title: "A Donkey Named Pepper",
      text: "Arne Schroeder would be honored to lend his donkey, Pepper, for the Palm Sunday procession. He mentions that Pepper has opinions about doorways.",
      choices: [
        { label: "Yes to Pepper!", fx: { harmony: 8, building: -4, strength: -4 },
          reply: "Pepper leads beautifully until the narthex door, where she plants all four hooves. “Hosanna!” shouts Bea. Pepper walks in, at last, to applause." },
        { label: "Pepper can greet outside", fx: { harmony: 4 },
          reply: "Pepper greets everyone at the door with a palm frond tucked in her halter. She gets more compliments than the sermon." },
        { label: "Politely decline", fx: { harmony: -3, building: 2 },
          reply: "Arne understands. He sends a photo of Pepper anyway, wearing a palm frond. It goes on the office corkboard." }
      ] },

    { id: "laetare", when: { minWeek: 9, maxWeek: 9, day: 3, chance: 1 }, from: "Marge", kind: "call", title: "Laetare",
      text: "Marge: “Laetare already. The rose paraments are out, and they need pressing, and Lent is half over, and I haven’t given up chocolate properly yet.”",
      choices: [
        { label: "Help her press them", fx: { marge: -12, strength: -3, sermon: -2 },
          reply: "An hour at the ironing board. Marge explains that Laetare means “rejoice” and the rose is a breath halfway through Lent. “Even Lutherans need a breath,” she says." },
        { label: "Tell her grace beats chocolate", fx: { marge: -6, sermon: 3 },
          reply: "“Lent isn’t a test you pass, Marge. Christ already passed it for you.” She considers this. Then she eats a chocolate, thoughtfully." }
      ] },

    { id: "samBirthday", when: { minWeek: 10, maxWeek: 10, day: 3, chance: 1 }, from: "Bea", kind: "knock", title: "Mom’s Birthday",
      text: "Bea, whispering in the office doorway: “It’s Mom’s birthday tomorrow and we don’t have a present and you SAID you would remember.” You did say that.",
      choices: [
        { label: "Clear the afternoon, bake a cake", fx: { family: 12, sermon: -6 },
          reply: "The cake leans like Pisa. Bea adds forty star sprinkles. Sam laughs until crying and says it’s the best birthday in years." },
        { label: "Dinner at the Willow Café", fx: { family: 8, strength: -2 },
          reply: "Deb puts a candle in a slice of pie and the whole café sings, badly. Sam pretends to be embarrassed. Sam is delighted." },
        { label: "Grab something on the way home", fx: { family: 3, sermon: 3 },
          reply: "A scarf from the hardware store (a hardware store with ambitions). Sam is kind about it. Bea’s drawing wins the day." }
      ] },

    { id: "graceArrives", when: { minWeek: 10, maxWeek: 10, day: 2, chance: 1, notFlag: "graceBorn" }, from: "Daniel Nguyen", kind: "call", title: "A Photo from Daniel",
      text: "A text from Daniel: a photo of a tiny, furious, perfect baby. “GRACE. 6 lb 11 oz. Linh is amazing. I am crying. Please pray. Also what do we do now?”",
      choices: [
        { label: "Call and pray with them", fx: { nguyen: -15, strength: -2 }, set: "graceBorn",
          reply: "Speakerphone, a newborn squeaking in the background. You give thanks for Grace and pray for sleep. Daniel says, “Amen, also we’ll take any sleep we can get.”" },
        { label: "Text back a blessing", fx: { nguyen: -8 }, set: "graceBorn",
          reply: "“The LORD bless thee, and keep thee” (Numbers 6:24). Daniel replies with eleven heart emojis and a photo of Grace yawning." }
      ] },

    { id: "lilies", when: { minWeek: 11, maxWeek: 11, day: 0, chance: 1 }, from: "Hannah", kind: "call", title: "Lily Season",
      text: "Hannah: “The Easter lilies arrived. Forty of them. The sopranos are sneezing in harmony. Marge says lilies are tradition. My altos say they’re a biohazard.”",
      choices: [
        { label: "Move the lilies to the narthex", fx: { harmony: -2, hannah: -8, marge: 6 },
          reply: "The narthex looks like a florist’s. The sopranos recover. Marge says the chancel looks “bare as Good Friday,” which, this week, is half right." },
        { label: "Keep them; buy tissues", fx: { harmony: 2, building: -2, hannah: 6, marge: -6 },
          reply: "A box of tissues on every choir chair. The Alleluias are glorious and slightly nasal." },
        { label: "Silk lilies in the loft", fx: { harmony: 4, building: -4, marge: 4, hannah: -6 },
          reply: "Silk in the choir loft, real ones at the altar. Marge calls it “a compromise with the Philistines,” but lets it happen. The sneezing stops by Friday." }
      ] },

    { id: "newBoilerDay", when: { minWeek: 11, maxWeek: 11, day: 1, chance: 1, notFlag: "newBoiler" }, from: "Gus", kind: "call", title: "Installation Day",
      text: "Gus: “They’re putting the new boiler in today, Pastor. Thought you’d want to know. I’m not crying. It’s dusty down here.”",
      choices: [
        { label: "Go down and see it", fx: { gus: -12, strength: -2, sermon: -2 }, set: "newBoiler",
          reply: "Small, shiny and humming. Gus introduces you to it, formally. You shake hands with the installer and, at Gus’s insistence, pat the boiler." },
        { label: "Thank him by phone", fx: { gus: -5, sermon: 2 }, set: "newBoiler",
          reply: "“Thank you for keeping us warm all winter, Gus.” A long pause. “Well,” he says. “Somebody had to.” You can hear the new one humming behind him." }
      ] },

    { id: "baptismCall", when: { minWeek: 12, maxWeek: 12, day: 0, chance: 1, flag: "graceBorn", notFlag: "baptismPlanned" }, from: "Linh Nguyen", kind: "call", title: "About Sunday",
      text: "Linh: “Pastor, Daniel’s mother asks every day when Grace will be baptized. We’d like it to be this Sunday, if that’s not too soon?”",
      choices: [
        { label: "This Sunday is perfect", fx: { nguyen: -15, strength: -3 }, set: "baptismPlanned",
          reply: "Quasimodogeniti: “As newborn babes, desire the sincere milk of the word” (1 Peter 2:2). You couldn’t have planned it better. God did." },
        { label: "Yes, and let’s talk tonight", fx: { nguyen: -20, strength: -5, family: -3 }, set: "baptismPlanned",
          reply: "Tea at their kitchen table, Grace asleep in a car seat. You walk them through the service, line by line. “So God does all of it?” Linh asks. Yes." }
      ] },

    { id: "olsenRest", when: { minWeek: 12, maxWeek: 12, day: 3, chance: 1, notFlag: "olsenDied" }, from: "Karen Olsen", kind: "call", title: "A Call at Dawn",
      text: "Karen, Mrs. Olsen’s daughter: “Mom died in her sleep last night. It was peaceful. She left a card with her funeral hymns on the nightstand. Of course she did.”",
      choices: [
        { label: "Go to the house now", fx: { harmony: 4, strength: -5, sermon: -4 }, set: "olsenDied",
          reply: "In the kitchen, under the lefse griddle, you pray with Karen: “I am the resurrection, and the life” (John 11:25). Karen says it with you, from memory. Her mother taught her." },
        { label: "Pray with Karen on the phone", fx: { strength: -2, sermon: 2 }, set: "olsenDied",
          reply: "You commend her mother to God and give thanks for ninety-one years. “She’d say you prayed too long,” Karen says, laughing and crying at once." }
      ] },

    { id: "funeral", when: { minWeek: 13, maxWeek: 13, day: 0, chance: 1, flag: "olsenDied" }, from: "Karen Olsen", kind: "knock", title: "Planning the Funeral",
      text: "Karen brings her mother’s card to the office: three hymns, Job 19, “lefse at the lunch,” and, underlined twice, “Short sermon.” The funeral is tomorrow afternoon.",
      choices: [
        { label: "Plan four minutes of hope", fx: { harmony: 4, strength: -4, sermon: -3 },
          reply: "“For I know that my redeemer liveth” (Job 19:25). Christ is risen, so Ingrid will rise. It fits on one card. Somewhere, she approves." },
        { label: "Ask her students to read", fx: { harmony: 6, strength: -2, sermon: -4 },
          reply: "Three of her old Sunday school students will each read a memory verse she taught them: a banker, a farmer and a missionary nurse. Karen cries, then laughs." },
        { label: "Help Karen with the lunch", fx: { harmony: 4, family: -3, strength: -3 },
          reply: "Gus volunteers to make the coffee. He tells you she once caught him stealing cookies in 1959 and made him learn Psalm 23. He still knows it, start to finish." }
      ] },

    { id: "goodShepherd", when: { minWeek: 13, maxWeek: 13, day: 3, chance: 1 }, from: "Bea", kind: "knock", title: "Misericordias Domini",
      text: "Bea has made sheep for Good Shepherd Sunday: forty paper sheep, one for every kid in Sunday school, each with a name. “So Jesus knows which ones they are,” she explains.",
      choices: [
        { label: "Hang them by the altar", fx: { family: 6, harmony: 4, strength: -2 },
          reply: "“he calleth his own sheep by name” (John 10:3). Forty paper sheep on the rail. Every child finds theirs before the service. So do some grandparents." },
        { label: "Use them in the children’s sermon", fx: { family: 4, sermon: 5 },
          reply: "You hold up each sheep and read the name. Each child stands up. “The Good Shepherd knows your name,” you say. Bea, front row, beams like a lamp." }
      ] },

    { id: "potluckSignup", when: { minWeek: 14, maxWeek: 14, day: 0, chance: 1 }, from: "Fellowship committee", kind: "email", title: "The Sign-Up Sheet",
      text: "The spring potluck sheet is up. Line 1: “Jello salad.” Lines 2 to 9: also jello salad, each with a slightly hostile flavor note. Someone has written NOT LIME beside line 6.",
      choices: [
        { label: "Sign up for jello yourself", fx: { harmony: 4, strength: -2 },
          reply: "You write “Pastor: lime, with confidence.” A hush falls over the narthex. By Sunday you have received two recipes and one warning." },
        { label: "Declare a judged jello class", fx: { harmony: 6, strength: -4 },
          reply: "Three judges: Deb, Nurse Carol and Bea. The jello entrants are thrilled. The rest of the sheet fills with hotdish, bars and one bowl of guacamole." },
        { label: "Add a line: NOT JELLO", fx: { harmony: -3, building: 2 },
          reply: "Your line is ignored. Three more jellos appear beneath it, one of them, defiantly, lime." }
      ] },

    { id: "potluck", when: { minWeek: 15, maxWeek: 15, day: 4, chance: 1 }, from: "Pete", kind: "knock", title: "The Spring Potluck",
      text: "Thirty-one hotdishes, nine jellos, one guacamole. At the far end of the fellowship hall Gus and Marge stand on either side of the thermostat like two old cowboys. Everyone pretends not to watch.",
      choices: [
        { label: "Hand them each a plate of pie", fx: { gus: -15, marge: -15, harmony: 8, strength: -3 }, set: "trucePact",
          reply: "Pie first, words later. Between bites Gus says, “Sixty-seven?” Marge says, “For Leonard.” They shake hands over the thermostat. The room erupts." },
        { label: "Ask them to say grace together", fx: { gus: -10, marge: -10, harmony: 12, strength: -2 }, set: "trucePact",
          reply: "They pray in unison, mostly; Gus says “Amen” early and Marge laughs. That’s the end of the war: 67°F, by treaty, signed on a paper napkin." },
        { label: "Eat jello, let them sort it out", fx: { harmony: 5, strength: 4 }, set: "trucePact",
          reply: "You eat three kinds of jello while Bea mediates. Treaty: 67°F. Bea charges each of them a cookie. “Blessed are the peacemakers” (Matthew 5:9), she informs you." }
      ] },

    { id: "thanksgiving", when: { minWeek: 17, maxWeek: 17, day: 2, chance: 1 }, from: "Deb", kind: "call", title: "Thanksgiving at the Café",
      text: "Deb: “Community Thanksgiving at the café Thursday. Anybody who’s alone, it’s free. I need someone to say grace and someone to carve. I’m hoping you’re both.”",
      choices: [
        { label: "Say grace and carve", fx: { harmony: 8, strength: -5, family: -3 },
          reply: "Forty people, three turkeys, Walt at the head of a table of strangers who aren’t strangers by pie. You carve badly. Nobody minds." },
        { label: "Say grace, then home to family", fx: { harmony: 4, family: 8 },
          reply: "A short grace over a full café, then home to Sam’s stuffing and Bea’s place cards. Bea has made one for Biscuit." }
      ] },

    // Random events (any one per day at most; chance below 1)
    { id: "gasMoney", when: { minWeek: 1, maxWeek: 16, chance: 0.25 }, from: "A stranger", kind: "knock", title: "Twenty Dollars of Gas",
      text: "A man at the office door, thin coat, kind eyes, embarrassed. He’s on fumes, trying to get to his daughter in Sioux Falls. He asks for twenty dollars of gas.",
      choices: [
        { label: "Fill his tank yourself", fx: { strength: -3, building: -3, harmony: 2 },
          reply: "At the Cenex he tells you about his daughter and new granddaughter. “I was a stranger, and ye took me in” (Matthew 25:35). He waves all the way out of town." },
        { label: "Give from the pastor’s fund", fx: { building: -2 },
          reply: "The discretionary fund holds $40. You give him $30 and a sandwich from the fellowship fridge. He asks you to pray for him, so you do, right there in the doorway." },
        { label: "Point him to the county office", fx: { building: 2, strength: -1, harmony: -1 },
          reply: "You give him directions, a granola bar and a phone number. He thanks you politely. You think about him all afternoon, and pray for him that night." }
      ] },

    { id: "thermostatWar", when: { minWeek: 2, maxWeek: 7, chance: 0.5 }, from: "Marge", kind: "call", title: "The Thermostat Escalates",
      text: "Someone has taped cardboard over the thermostat: “DO NOT TOUCH. G.” Underneath, in different handwriting: “OR WHAT? M.” Marge would like you to know she owns tin snips.",
      choices: [
        { label: "Call a thermostat summit", fx: { harmony: 5, strength: -5, gus: -5, marge: -5 },
          reply: "They sit across your desk, arms folded. You read “A soft answer turneth away wrath” (Proverbs 15:1). They agree on nothing, but agree to keep talking." },
        { label: "Take the cardboard down", fx: { harmony: -2, building: 2 },
          reply: "By noon there’s new cardboard, with a second page." },
        { label: "Hide it behind the hymn board", fx: { harmony: 3, gus: 4, marge: 4 },
          reply: "For one glorious week nobody finds it. Then Biscuit knocks the hymn board over during the sermon. The war resumes." }
      ] },

    { id: "biscuitManger", when: { minWeek: 2, maxWeek: 4, chance: 0.4 }, from: "Sunday school", kind: "call", title: "Away in a Manger",
      text: "The Sunday school superintendent calls: Biscuit has moved into the nativity manger in the narthex. The baby Jesus has been displaced to the shepherds’ area. Biscuit will not be moved.",
      choices: [
        { label: "Leave her; it’s charming", fx: { harmony: 4, building: -1 },
          reply: "The paper runs a photo: CHURCH CAT KEEPS WATCH. Three families come to see the cat and stay for the service. Biscuit ministers in her own way." },
        { label: "Gently evict her", fx: { harmony: -2, strength: -2 },
          reply: "You lift her out and put the baby Jesus back. She gives you a look of deep theological disappointment and goes to sleep in the offering plate." }
      ] },

    { id: "iceSteps", when: { minWeek: 1, maxWeek: 7, chance: 0.3 }, from: "Mrs. Dahl", kind: "call", title: "Snow on the Steps",
      text: "The church steps are a sheet of ice under new snow, and the quilting circle is stuck at the bottom “like penguins at a buffet,” according to Mrs. Dahl.",
      choices: [
        { label: "Grab the salt and go", fx: { building: 4, harmony: 4, strength: -4 },
          reply: "You salt, shovel and offer an arm. Every quilter makes it up the steps, and you are rewarded with a lap quilt “for the parsonage, dear.”" },
        { label: "Open the side door", fx: { harmony: 2, building: -2 },
          reply: "The side door, the ramp and the coat closet. The quilters approve. The salting waits until tomorrow, when it’s worse." }
      ] },

    { id: "weddingCouple", when: { minWeek: 5, maxWeek: 10, chance: 0.4 }, from: "Tyler & Kayla", kind: "email", title: "We’re Engaged!",
      text: "Tyler and Kayla, both 24, are engaged and would love a fall wedding at St. Luke’s. Kayla’s grandmother says they must “do the counselling thing” first. Are you free?",
      choices: [
        { label: "Six sessions, starting now", fx: { harmony: 5, strength: -6, sermon: -3 },
          reply: "First session, you ask how they handle arguments. They look at each other and say, “We don’t argue.” You schedule five more sessions." },
        { label: "One long talk over pie", fx: { harmony: 3, strength: -3 },
          reply: "Deb’s back booth, two slices of cherry, an honest talk. “Charity suffereth long, and is kind” (1 Corinthians 13:4). Kayla writes it on a napkin for the invitations." },
        { label: "Hand them a workbook", fx: { sermon: 4, harmony: -2 },
          reply: "A marriage-prep workbook to do at home. They do it, sort of. Tyler’s answers are mostly about fantasy football. It’s a start." }
      ] },

    { id: "lockIn", when: { minWeek: 6, maxWeek: 9, chance: 0.5 }, from: "Youth committee", kind: "email", title: "The Lock-In",
      text: "The youth lock-in is Friday night: eleven teenagers, pizza, dodgeball and a 2 a.m. movie. The chaperone list has one name on it, and it’s yours.",
      choices: [
        { label: "Chaperone all night", fx: { strength: -12, harmony: 6, josh: -10 },
          reply: "At 3 a.m. Josh and two others ask whether God made the dinosaurs. You talk until sunrise. You are destroyed. It was worth it." },
        { label: "Recruit Sam; take shifts", fx: { strength: -6, family: 4, harmony: 4 },
          reply: "Sam takes midnight to three, you take three to seven. Sam wins dodgeball. Your reputation never recovers." },
        { label: "Ask Daniel Nguyen to help", fx: { strength: -4, harmony: 3, nguyen: -5 },
          reply: "Daniel brings a chemistry demo (approved, nonflammable). The teenagers are hypnotized. You sleep two hours on the choir-room couch." }
      ] },

    { id: "soupSupper", when: { minWeek: 8, maxWeek: 10, chance: 0.5 }, from: "Fellowship committee", kind: "email", title: "Lenten Soup Supper",
      text: "Wednesday’s soup supper sign-up: seventeen slow cookers of chili. One chicken noodle. No bread. Someone has written “BREAD???” in red pen.",
      choices: [
        { label: "Bake bread with Bea", fx: { harmony: 5, strength: -5, family: 4 },
          reply: "Six loaves from the parsonage oven; Bea punches the dough with enthusiasm. At supper you think of “I am the bread of life” (John 6:35) and grin into your chili." },
        { label: "Call Deb for rolls", fx: { harmony: 4, building: -3 },
          reply: "Deb sends ten dozen rolls and refuses payment. “Put it toward the boiler,” she says. The chili is improved by the rolls. Most things are." },
        { label: "Embrace the chili", fx: { harmony: -2, strength: 3 },
          reply: "Chili Wednesday it is: seventeen kinds, from “Mild Lutheran” to “Gus’s Revenge.” Everyone survives. Barely." }
      ] },

    { id: "bat", when: { minWeek: 8, maxWeek: 16, chance: 0.3 }, from: "Marge", kind: "call", title: "A Bat in the Sanctuary",
      text: "Marge, whispering: “Pastor, there is a bat in the sanctuary. It is hanging from the Good Shepherd window. I do not believe it is Lutheran.”",
      choices: [
        { label: "Open the doors and wait", fx: { strength: -2, sermon: -2 },
          reply: "You open every door and sit in a back pew. It’s in the Bible, Marge: “and the lapwing, and the bat” (Leviticus 11:19). At dusk it leaves on its own." },
        { label: "Call Gus and his fishing net", fx: { gus: -8, building: 2, harmony: 2 },
          reply: "Gus arrives with a fishing net and a colander on his head. Forty minutes and one toppled candle stand later, the bat is free. Gus is a hero." },
        { label: "Let Biscuit handle it", fx: { harmony: -3, strength: 3 },
          reply: "Biscuit regards the bat. The bat regards Biscuit. Both decide this is above their pay grade. Marge decides you are, too." }
      ] },

    { id: "districtPresident", when: { minWeek: 9, maxWeek: 15, chance: 0.35 }, from: "District office", kind: "email", title: "A Visit from the District",
      text: "The district president will visit Sunday. He’d like a tour, lunch, and “a brief conversation about congregational vitality.” Pete has already printed eleven handouts.",
      choices: [
        { label: "Show him everything, warts too", fx: { harmony: 3, building: 2, strength: -4, sermon: -3 },
          reply: "The boiler room, the leaky corner, the full Sunday school room. “You’ve got a real church here,” he says. Pete frames the handout." },
        { label: "Focus on Sunday’s sermon", fx: { sermon: 8, harmony: -2 },
          reply: "You polish the sermon and let Pete give the tour. The district president likes the sermon and is now an expert on your boiler." },
        { label: "Take him to the Willow Café", fx: { harmony: 4, strength: -2 },
          reply: "Deb serves pie and local news in equal measure. He leaves with a slice for the road and a better sense of Willow Creek than any handout could give." }
      ] },

    { id: "councilLong", when: { minWeek: 2, maxWeek: 16, chance: 0.3 }, from: "Pete", kind: "call", title: "Council Night",
      text: "Pete: “Council’s tonight. Twelve agenda items. Item 9 is the thermostat. Item 11 is also, somehow, the thermostat.”",
      choices: [
        { label: "Help Pete keep to the agenda", fx: { building: 5, harmony: -2, strength: -4 },
          reply: "Pete adjourns at 8:57. A record. Gus checks his watch twice. Item 11 is tabled until further notice, possibly the Second Coming." },
        { label: "Let everyone be heard", fx: { harmony: 6, strength: -8, family: -5 },
          reply: "Adjourned at 11:20. Everyone was heard, twice. Nobody leaves angry, which, at a council meeting, is a small miracle." },
        { label: "Open with Bible study", fx: { harmony: 3, sermon: 3, strength: -5 },
          reply: "Twenty minutes on Acts 6 and the first church committee. Everyone is calmer. The meeting still runs until ten, but kinder." }
      ] },

    { id: "strangerDying", when: { minWeek: 4, maxWeek: 16, chance: 0.25 }, from: "Nurse Carol", kind: "call", title: "Room 4",
      text: "Nurse Carol, 11 p.m.: “Room 4. Not a member of anything. He’s dying and he asked for a pastor. Any pastor. You’re the one I’ve got.”",
      choices: [
        { label: "Go now", fx: { strength: -10, family: -4, harmony: 3 },
          reply: "His name is Frank. He asks if God can forgive a whole life. You say: “I forgive you all your sins in the name of the Father and of the Son and of the Holy Spirit.” He sleeps." },
        { label: "Pray by phone, go at dawn", fx: { strength: 2, harmony: -2 },
          reply: "Carol holds the phone for Frank while you pray. At dawn she meets you in the hall. He died at four, she says, with the night nurse reading him a psalm." }
      ] },

    { id: "beaQuestion", when: { minWeek: 0, maxWeek: 17, chance: 0.25 }, from: "Bea", kind: "knock", title: "A Bedtime Question",
      text: "Bea, at bedtime, very serious: “Does Biscuit go to heaven? Because I already told Biscuit yes.”",
      choices: [
        { label: "Tell her God’s promise", fx: { family: 8, strength: -1 },
          reply: "You tell her what God says: “Behold, I make all things new” (Revelation 21:5). “ALL things?” “All things.” Bea decides that’s a yes and goes to sleep satisfied." },
        { label: "“That’s a seminary question”", fx: { family: 4, sermon: 2 },
          reply: "Bea goes to sleep delighted to have stumped a professional. In the morning she has three more questions ready." }
      ] },

    { id: "dateNight", when: { minWeek: 1, maxWeek: 16, chance: 0.3 }, from: "Sam", kind: "call", title: "A Real Tablecloth",
      text: "Sam: “I booked a sitter for Thursday. Dinner in Mankato. The real kind, with tablecloths. Please don’t schedule a hospital emergency.”",
      choices: [
        { label: "Go, phone off", fx: { family: 12, strength: 5, sermon: -4 },
          reply: "Tablecloths, candles, one dessert, two forks. You don’t talk about church once. You’d forgotten how much you like this person." },
        { label: "Go, phone on vibrate", fx: { family: 6, strength: 2, harmony: 2 },
          reply: "It buzzes twice, both about the thermostat. Sam confiscates the phone and puts it in a coat pocket. Fair." },
        { label: "Reschedule; it’s a heavy week", fx: { family: -6, sermon: 5 },
          reply: "Sam says it’s fine, and mostly means it. You promise next week. Write it in pen this time." }
      ] },

    { id: "pastorFriend", when: { minWeek: 3, maxWeek: 16, chance: 0.25 }, from: "Seminary friend", kind: "call", title: "A Call from Nebraska",
      text: "Your old seminary roommate, now a pastor in Nebraska, calls to check on you. “Are you taking your day off?” A pause. “That’s what I thought.”",
      choices: [
        { label: "Admit it; take one", fx: { strength: 12, sermon: -5, family: 4 },
          reply: "You take Friday off. The church does not fall down. It’s Christ’s church, not yours. “For so he giveth his beloved sleep” (Psalm 127:2)." },
        { label: "Talk shop for an hour", fx: { sermon: 5, strength: 3 },
          reply: "Sermon ideas, council stories, boiler talk. Theirs is from 1971. You feel competitive, then ashamed, then better." }
      ] },

    { id: "hymnBoard", when: { minWeek: 0, maxWeek: 17, chance: 0.2 }, from: "Hannah", kind: "call", title: "The Hymn Board",
      text: "Hannah: “Someone changed the hymn board. It says 1, 2, 3, 4, 5. That’s not hymns, Pastor. That’s counting.” The Sunday school class is suspiciously quiet.",
      choices: [
        { label: "Sing hymns 1 to 5 anyway", fx: { harmony: 5, hannah: 8 },
          reply: "Hymn 1 is fine. Hymn 4 is a funeral hymn. Hymn 5 has eleven verses. The Sunday school learns an important lesson about consequences." },
        { label: "Have the kids fix it", fx: { harmony: 2, hannah: -5 },
          reply: "The kids put the right numbers back, with supervision. One asks if there’s a hymn number one thousand. There isn’t. She’s disappointed in the hymnal." }
      ] },

    { id: "bulletinTypo", when: { minWeek: 6, maxWeek: 16, chance: 0.2 }, from: "Marge", kind: "call", title: "Holy, Holy, Holly",
      text: "Marge, reading from Sunday’s bulletin: “Hymn of the Day: ‘Holy, Holy, Holly.’ With two L’s. Pastor. It is not Christmas.”",
      choices: [
        { label: "Reprint every bulletin", fx: { building: -3, sermon: -3, marge: -8 },
          reply: "Ninety bulletins, reprinted. Marge personally checks every one. “Holy, holy, holy, is the LORD of hosts” (Isaiah 6:3). Three times, one L each." },
        { label: "Laugh about it from the pulpit", fx: { harmony: 4, marge: 6 },
          reply: "You confess the typo during announcements. It gets the biggest laugh of the year. Marge forgives you by Advent." }
      ] },

    { id: "organCipher", when: { minWeek: 0, maxWeek: 17, chance: 0.2 }, from: "Hannah", kind: "call", title: "The Stuck Note",
      text: "Hannah: “The organ has a cipher. One note stuck on: a low F, constantly, like a sad tugboat. Sunday is in four days.”",
      choices: [
        { label: "Call the organ technician", fx: { building: -6, hannah: -10 },
          reply: "He drives from Mankato, fixes it in ten minutes, and bills for two hours. Hannah plays a victory toccata. Pete reads the bill twice." },
        { label: "Investigate with Gus", fx: { building: -1, strength: -5, gus: -5, hannah: -5 },
          reply: "Inside the organ chamber you find the problem: a pencil wedged in a pipe. Behind it: Biscuit, who has been living in the organ." }
      ] },

    { id: "foodPantry", when: { minWeek: 1, maxWeek: 16, chance: 0.3 }, from: "Deb", kind: "call", title: "The Empty Shelf",
      text: "Deb: “The food pantry shelf at the café is bare again. It’s been a hard stretch for some folks. Can St. Luke’s help?”",
      choices: [
        { label: "Announce a food drive", fx: { harmony: 6, strength: -2 },
          reply: "By Sunday the narthex holds a mountain of canned corn, peanut butter and, inexplicably, eleven jars of pickled herring. Deb takes it all." },
        { label: "Buy groceries today", fx: { building: -4, harmony: 3, strength: -3 },
          reply: "A cart full of cereal, beans and diapers, straight from the discretionary fund. Deb shelves it while you’re still unloading." }
      ] },

    { id: "beaSick", when: { minWeek: 1, maxWeek: 16, chance: 0.25 }, from: "Sam", kind: "call", title: "A Fever",
      text: "Sam, from work: “Bea’s school called. Fever, a hundred and one. Can you get her? I’m in meetings till four.”",
      choices: [
        { label: "Pick her up, work from home", fx: { family: 8, sermon: -6, strength: -2 },
          reply: "Bea under three blankets, cartoons on low. You write the sermon on the floor beside her. She wakes once to ask if Jesus ever had a fever. Probably. He was a kid." },
        { label: "Bring her to the office", fx: { family: 4, sermon: -2, harmony: 2 },
          reply: "Bea naps on the office couch with Biscuit on her feet. Every visitor tiptoes. The church has never been so quiet." }
      ] },

    { id: "roof", when: { minWeek: 12, maxWeek: 14, chance: 0.5 }, from: "Gus", kind: "call", title: "Spring Rain",
      text: "Gus: “Spring rain’s found a new way in. Northeast corner of the sanctuary has a drip, right over pew nine, which is the Lindqvist pew.”",
      choices: [
        { label: "Patch it with Gus", fx: { building: 8, strength: -6 },
          reply: "You hold the ladder while Gus tars the flashing. “And the rain descended, and the floods came” (Matthew 7:25), he mutters. “House on the rock, Pastor. Not under it.”" },
        { label: "Bucket now, council later", fx: { building: 3, harmony: -2, marge: 6 },
          reply: "A bucket goes in pew nine and the roof goes on the agenda. Marge sits in pew ten for a month, under protest, keeping the bucket company." },
        { label: "Call a roofer today", fx: { building: 6, harmony: 2, pete: 6 },
          reply: "The roofer comes Wednesday and fixes it by Friday. Pete looks at the invoice and quietly adds a tab called ROOF (WHY)." }
      ] },

    { id: "vbs", when: { minWeek: 14, maxWeek: 17, chance: 0.5 }, from: "VBS committee", kind: "email", title: "Vacation Bible School",
      text: "VBS planning: the committee has chosen “Ocean Adventure: Diving Deep with Jesus,” and would like you to dress as a whale for the Jonah skit.",
      choices: [
        { label: "Be the whale", fx: { harmony: 6, family: 4, strength: -5 },
          reply: "You are a magnificent whale. Thirty kids cheer when you spit out Daniel Nguyen. Bea is mortified and proud in equal measure." },
        { label: "Teach the stories instead", fx: { sermon: 4, harmony: 3 },
          reply: "Jonah, the storm, Peter on the water. “Peace, be still” (Mark 4:39). A kindergartner asks if Jesus can calm her baby brother. Worth a try." },
        { label: "Delegate the whale to Josh", fx: { josh: -10, harmony: 3 },
          reply: "Josh is a good whale, except that he keeps breaking character to explain the plot. The kids adore him." }
      ] },

    { id: "reformationLunch", when: { minWeek: 16, maxWeek: 16, chance: 0.7 }, from: "Pete", kind: "call", title: "Reformation Bratwurst",
      text: "Pete: “For Reformation Sunday someone suggested a bratwurst lunch. Someone else suggested a Luther costume contest. I want you to know it wasn’t me.”",
      choices: [
        { label: "Brats and costumes, both", fx: { harmony: 8, building: -3, strength: -3 },
          reply: "Eleven Luthers, two Katies and one Biscuit in a paper hat. Bea wins as Katharina von Bora, carrying a frying pan. The brats are excellent." },
        { label: "Just brats", fx: { harmony: 4 },
          reply: "Brats, sauerkraut and mustard on the church lawn. Gus mans the grill and explains the history of the bratwurst to anyone within range." },
        { label: "A hymn sing instead", fx: { harmony: 3, sermon: 4, hannah: -8 },
          reply: "An afternoon of Reformation hymns around the organ. Hannah is in heaven. Gus sings bass on “A Mighty Fortress” loud enough to rattle the hymn board." }
      ] }
  ],

  // ───────────────────────── 4. Special services ─────────────────────────
  // flagBeats (optional): a beat the engine may append when that flag is set.
  specials: {
    lent: { title: "Midweek Lenten Vespers", fx: { harmony: 2, strength: -3 },
      beats: [
        "Soup supper first: eleven slow cookers, too many crackers, and Gus explaining his chili to anyone who stands still.",
        "Then Evening Prayer in the half-dark, violet on the altar, the Passion read a section at a time.",
        "“But he was wounded for our transgressions, he was bruised for our iniquities” (Isaiah 53:5).",
        "The candles go out. Everyone files into the cold, quieter than they came, and nobody minds."
      ] },
    funeral: { title: "Ingrid Olsen, 1935–2027", fx: { harmony: 8, strength: -8 },
      beats: [
        "The church is fuller than Easter: four generations of her Sunday school students. Karen and the grandchildren spread the white pall over the casket, the way her baptism once covered her.",
        "“I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live” (John 11:25).",
        "At the cemetery on the hill the wind is cold and the words are few. “Them also which sleep in Jesus will God bring with him” (1 Thessalonians 4:14).",
        "Then lefse and coffee in the fellowship hall, exactly as the card said. There is lefse. Of course there is."
      ] },
    advent: { title: "Midweek Advent Vespers", fx: { harmony: 2, strength: -2 },
      beats: [
        "Twenty-some people in winter coats sing “O Come, O Come, Emmanuel” by the light of the Advent wreath.",
        "“The people that walked in darkness have seen a great light” (Isaiah 9:2).",
        "Afterward, soup in the fellowship hall. Somebody always brings chili. Somebody always says it’s too spicy."
      ] },
    christmasEve: { title: "Christmas Eve by candlelight", fx: { harmony: 6, strength: -6 },
      beats: [
        "Three services tonight: four o’clock with the children’s pageant (one shepherd in tears), seven, and eleven by candlelight.",
        "Every pew is full: the regulars, the college kids home for break, and the once-a-year folks, who are every bit as welcome.",
        "“Fear not: for, behold, I bring you good tidings of great joy, which shall be to all people” (Luke 2:10).",
        "The lights go down. Flame passes candle to candle down every row, and the whole church sings “Silent Night.”"
      ] },
    ashWednesday: { title: "Ash Wednesday", fx: { strength: -3 },
      beats: [
        "You trace a cross of ash on each forehead: Pete’s, Marge’s, Josh’s, and Bea’s small one.",
        "“for dust thou art, and unto dust shalt thou return” (Genesis 3:19).",
        "The ash is shaped like a cross. Dust is not the end of the story."
      ] },
    maundyThursday: { title: "Maundy Thursday", fx: { harmony: 3, strength: -3 },
      beats: [
        "“This is my body which is given for you: this do in remembrance of me” (Luke 22:19).",
        "Then, in silence, you and the altar guild strip the altar: candles, linens, paraments, until only bare wood remains.",
        "Everyone leaves without a word. Marge stays a minute longer, folding."
      ] },
    goodFriday: { title: "Good Friday", fx: { strength: -4 },
      beats: [
        "The Passion is read, and the candles go out one by one.",
        "“It is finished” (John 19:30).",
        "A book slams shut in the dark. Everyone leaves in silence, and for once nobody checks a phone."
      ] },
    easterSunrise: { title: "Easter sunrise", fx: { harmony: 8, strength: -6 },
      beats: [
        "6:30 a.m. Frost on the grass, the sky going pink behind the grain elevator.",
        "“He is risen!” you call. “He is risen indeed. Alleluia!” comes back, louder than seventy people should be able to manage.",
        "The brass come in on “Jesus Christ Is Risen Today,” and Biscuit flees the chancel. Even the cat knows something has happened."
      ],
      flagBeats: {
        pastorSolo: "You sing the first verse alone. It cracks once, on an Alleluia. Nobody minds. Hannah is crying, for reasons of her own.",
        waltSings: "Under the Alleluias, a steady bass voice holds everything up: Walt Peterson, back in his old chair in the loft."
      } },
    pentecost: { title: "Confirmation Sunday", fx: { harmony: 5 },
      beats: [
        "Red paraments, red geraniums, and the confirmands in white robes with sleeves too long.",
        "They confess the faith they were baptized into. You lay a hand on each head and pray.",
        "“For the promise is unto you, and to your children” (Acts 2:39). Biscuit, for once, sits perfectly still."
      ],
      flagBeats: {
        joshReady: "Josh kneels last, hood down. His verse is read aloud: “Lord, I believe; help thou mine unbelief” (Mark 9:24). His mother cries. So, a little, does Josh."
      } },
    baptism: { title: "Baby Grace’s baptism", fx: { harmony: 6, nguyen: -15 },
      beats: [
        "Linh holds Grace in a white gown that was Daniel’s grandmother’s. Daniel holds the candle as if it might explode.",
        "Walt and Marge stand with them as Grace’s sponsors, to pray for her and teach her the faith. Walt has ironed his tie. Marge has ironed Walt.",
        "“Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost” (Matthew 28:19).",
        "“Grace, I baptize you in the name of the Father and of the Son and of the Holy Spirit.” Water and the Word: God’s work, God’s promise, God’s child. She sleeps right through it."
      ] }
  },

  // ───────────────────────── 5. At the door ─────────────────────────
  door: {
    great: [
      "“I didn’t look at my watch once. Well, twice. That’s a record.”",
      { who: "gus", text: "Gus: “Good one, Pastor. Solid. Like a boiler.” From Gus, this is a sonnet." },
      { who: "marge", text: "Marge: “That sermon warmed me right up. Don’t tell Gus.”" },
      { who: "walt", text: "Walt holds your hand a moment longer than usual. “Ruth would have liked that one.”" },
      { who: "pete", text: "Pete: “I didn’t think about the budget for twenty whole minutes. Thank you.”" },
      { who: "josh", text: "Josh, not looking up from his phone: “That was actually okay.” From Josh, a standing ovation." },
      { who: "hannah", text: "Hannah: “You ended exactly on time and the hymn fit perfectly. I could weep.”" },
      "Deb from the café: “I’m naming a pie after that sermon.” You’re not sure what that means, but it’s a compliment.",
      "A farmer: “Short and good. Like a rain in July.”",
      "Mrs. Dahl, 99: “I heard every word, and my hearing aid wasn’t even on.”",
      "“That’s my pastor,” Bea tells everyone in line. It is the best review you will ever get.",
      "“I’ll be thinking about that all week,” says someone you didn’t know was listening."
    ],
    good: [
      "“Lovely sermon, Pastor. A bit long.”",
      "“Good sermon. Is the coffee ready?”",
      { who: "marge", text: "Marge: “Very nice. The hymn after was in the wrong key, but that’s Hannah’s department.”" },
      { who: "pete", text: "Pete: “Good sermon. Quick question about the boiler fund—” and you’re off." },
      { who: "hannah", text: "Hannah: “Good. You cued the hymn perfectly. Mostly.”" },
      { who: "nguyen", text: "Daniel Nguyen: “We’re still learning when to stand and when to sit. But we’ll be back.”" },
      { who: "gus", text: "Gus nods once. “Good,” he says, and goes to check the thermostat." },
      "“You said exactly what I needed,” a woman says, and hurries off before you can ask which part.",
      "“Good sermon. My husband slept, but he looked very peaceful.”",
      "A kid hands you a bulletin drawing of you preaching. You have six arms. It feels accurate.",
      "“I loved the part about the sheep,” says a man. There was no part about sheep. You’ll take it."
    ],
    fine: [
      "“Nice sermon, Pastor. Where’s the coffee?”",
      "“Well,” says Arne, which in Willow Creek can mean a great many things.",
      "“You seemed tired, Pastor. Get some rest.” Kindly meant. Still stings a little.",
      { who: "josh", text: "Josh: “You said ‘in conclusion’ twice.”" },
      { who: "marge", text: "Marge: “It was fine. A bit warm in here, though.” It was sixty-four degrees." },
      { who: "pete", text: "Pete: “Good. Fine. Good. Did you know the offering was down four percent?”" },
      { who: "gus", text: "Gus: “Sermon ran a little cold today, Pastor. Like this building used to.”" },
      "“Good effort,” says a retired teacher, as if you’d handed in a book report.",
      "A child: “Why did you say the same thing three times?” Her mother apologizes. The child is right.",
      "“The Gospel was good,” someone says. The Gospel always is. That’s the point.",
      "“Interesting,” says a woman, in a tone that means she was thinking about lunch."
    ],
    thin: [
      "“Short one today!” says a man, delighted. It’s the only thing he’s delighted about.",
      "“Are you feeling all right, Pastor?”",
      "Someone shakes your hand and says, “Well, the hymns were nice.”",
      { who: "hannah", text: "Hannah: “I played the postlude extra loud. You’re welcome.”" },
      "An old farmer, gently: “The Word did its work today, Pastor, even if you didn’t.” He’s right, and it helps.",
      "A visitor asks where the restroom is. That’s the only comment.",
      { who: "marge", text: "Marge pats your arm. “We all have Sundays like that, dear. Even Luther, I expect.”" },
      "“Did you lose your notes?” You didn’t have notes. That was the problem.",
      { who: "walt", text: "Walt: “Ruth used to say the Gospel is sturdy enough to survive any preacher.” He means it as comfort. It is." },
      { who: "josh", text: "Josh: “That was weird.” Fair." },
      "Deb: “Pie’s on me this week, Pastor. You look like you need it.”",
      "“Even on a thin Sunday, God’s Word does what He sends it to do,” Mrs. Dahl says, patting your hand."
    ]
  },

  // ───────────────────────── 6. The year in review ─────────────────────────
  endings: {
    shepherd: { title: "Feed My Sheep",
      text: "You preached, you visited, you rested now and then, and you loved these people: not perfectly, but faithfully. The sheep were never yours. They were given you to feed, and you fed them." },
    preacher: { title: "The Word Went Out",
      text: "Your sermons this year were something; people still quote the one about the lost coin. But some knocks went unanswered and some kitchen tables waited a long while. Next year, carry the Word to them too." },
    pastor: { title: "At Every Bedside",
      text: "You were at every bedside, every kitchen table, every crisis. Some Sundays the sermon ran thin, and the Word did its work anyway. Next year, give the study a few more mornings. Your people will be glad you did." },
    builder: { title: "Except the Lord Build the House",
      text: "A new boiler humming, the books balanced, the roof dry over pew nine. “Except the LORD build the house, they labour in vain that build it” (Psalm 127:1). He built it; you held the ladder." },
    tired: { title: "A Rest for the People of God",
      text: "You gave everything this year, and then some. Hear this: the church is Christ’s, not yours to carry. “There remaineth therefore a rest to the people of God” (Hebrews 4:9). That includes you. Rest is His gift. Take it." }
  },

  closing: "“Lord, thou knowest all things; thou knowest that I love thee. Jesus saith unto him, Feed my sheep.” (John 21:17)"
};
