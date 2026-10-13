// Talk Tap vocabulary library. Data only: the app, the audio build and the picture build all read from here.
// Each word carries five stages: 1 single word, 2 two-word phrase, 3 simple sentence, 4 descriptive sentence, 5 conversational question or request.
// p = picture prompt for generation. f = the Find it line when "Find the ___." does not fit. q = the Say it question per stage (index 0..4), defaults by category.
const VOCAB_CATS={
  needs:"Needs and requests",people:"People and family",food:"Food and drink",body:"My body",objects:"Things at home",
  animals:"Animals",actions:"Actions",feelings:"Feelings",describe:"Describing words",places:"Places",positions:"Positions",
  social:"Being with people",colours:"Colours and numbers"
};
const VOCAB_Q={
  needs:["What do you need?","What do you need?","What do you need?","What do you need?","Ask me."],
  people:["Who is this?","Who is this?","Who do you see?","Who do you see?","Ask them."],
  food:["What is this?","What do you want?","What do you want?","What do you want?","Ask me."],
  body:["What is this?","Whose is it?","What is this?","What are you doing?","Ask me."],
  objects:["What is this?","Whose is it?","What do you want?","What do you want?","Ask me."],
  animals:["What is this?","What is it like?","What do you see?","What do you see?","Ask me."],
  actions:["What is this?","What are you doing?","What can you do?","What can you do?","Ask me."],
  feelings:["How does he feel?","How do you feel?","How do you feel?","How do you feel?","Ask me."],
  describe:["What is it like?","What is it like?","What is it like?","What is it like?","Ask me."],
  places:["Where is this?","Where do you go?","Where do you go?","Where do you want to go?","Ask me."],
  positions:["Where is it?","Where is it?","Where is it?","Where is it?","Ask me."],
  social:["What do you say?","What do you say?","What do you say?","What do you say?","Say it to me."],
  colours:["What colour?","What do you see?","What do you see?","What do you see?","Ask me."]
};
const V=(id,w,e,cat,st,p,x)=>({id,w,e,cat,st,p,...(x||{})});
const VOCAB=[
// Needs and requests. These also live on the needs board, where a tap speaks them with no quiz.
V("more","more","➕","needs",["more","want more","I want more.","I want more, please.","Can I have more?"],"the boy at a table holding out an empty bowl with both hands, asking for more",{f:"Find more."}),
V("help","help","🙋","needs",["help","need help","I need help.","I need help, please.","Can you help me?"],"the boy with one hand raised, looking at a grown-up, asking for help",{f:"Find help."}),
V("stop","stop","✋","needs",["stop","stop now","Stop, please.","Please stop that now.","Can you stop?"],"the boy holding up a flat palm in a clear stop gesture",{f:"Find stop."}),
V("open","open","🔓","needs",["open","open it","Open it, please.","Please open the box.","Can you open it?"],"the boy holding a closed jar out to a grown-up to open it",{f:"Find open."}),
V("hungry","hungry","🍽️","needs",["hungry","I'm hungry","I am hungry.","I am very hungry.","Can I have food?"],"the boy holding their tummy and looking at an empty plate, hungry",{f:"Find hungry."}),
V("thirsty","thirsty","🥤","needs",["thirsty","I'm thirsty","I am thirsty.","I am very thirsty.","Can I have a drink?"],"the boy holding an empty cup upside down, thirsty",{f:"Find thirsty."}),
V("all_done","all done","✅","needs",["all done","I'm done","I am all done.","I am all done eating.","Can I go now?"],"the boy pushing away a finished empty plate, hands open, all done",{f:"Find all done."}),
V("want","want","👉","needs",["want","I want","I want that.","I want that one, please.","Can I have that?"],"the boy pointing at a toy on a high shelf, wanting it",{f:"Find want."}),
// People and family
V("mummy","Mummy","👩","people",["Mummy","hi Mummy","I see Mummy.","I see Mummy cooking.","Mummy, where are you?"],"Mum, smiling, waving at the viewer"),
V("daddy","Daddy","👨","people",["Daddy","hi Daddy","I see Daddy.","I see Daddy driving.","Daddy, where are you?"],"Dad, smiling, waving at the viewer"),
V("brother","brother","👦","people",["brother","my brother","This is my brother.","My brother is playing.","Where is my brother?"],"the boy smiling, waving, standing by a toy car"),
V("sister","sister","👧","people",["sister","my sister","This is my sister.","My sister is reading.","Where is my sister?"],"the girl smiling, waving, holding a book"),
V("teacher","teacher","👩‍🏫","people",["teacher","my teacher","This is my teacher.","My teacher is kind.","Teacher, can you help me?"],"a friendly teacher standing by a whiteboard with letters"),
V("friend","friend","🧑‍🤝‍🧑","people",["friend","my friend","This is my friend.","My friend is funny.","Will you be my friend?"],"the boy and another child side by side, arms around shoulders, smiling"),
V("grandma","Grandma","👵","people",["Grandma","hi Grandma","I see Grandma.","Grandma is sitting down.","Grandma, can I sit with you?"],"a kind grandmother with grey hair sitting in an armchair, smiling"),
V("baby","baby","👶","people",["baby","the baby","The baby is sleeping.","The baby is sleeping in the cot.","Is the baby sleeping?"],"a baby sleeping in a cot with a blanket"),
// Food and drink
V("water","water","💧","food",["water","want water","I want water.","I want cold water.","Mummy, can I have water?"],"a clear glass of water on a table"),
V("juice","juice","🧃","food",["juice","want juice","I want juice.","I want orange juice.","Can I have juice, please?"],"a glass of orange juice with a straw"),
V("milk","milk","🥛","food",["milk","want milk","I want milk.","I want warm milk.","Can I have milk, please?"],"a glass of milk next to a milk carton"),
V("rice","rice","🍚","food",["rice","want rice","I want rice.","I want rice and chicken.","Can I have rice, please?"],"a plate of white rice with a spoon"),
V("bread","bread","🍞","food",["bread","want bread","I want bread.","I want bread with butter.","Can I have bread, please?"],"two slices of bread on a plate"),
V("chicken","chicken","🍗","food",["chicken","want chicken","I want chicken.","I want hot chicken.","Can I have chicken, please?"],"a plate of roast chicken pieces"),
V("apple","apple","🍎","food",["apple","an apple","I want an apple.","I want a red apple.","Can I have an apple?"],"a shiny red apple on a plate"),
V("banana","banana","🍌","food",["banana","a banana","I want a banana.","I want a yellow banana.","Can I have a banana?"],"a yellow banana on a plate"),
V("biscuit","biscuit","🍪","food",["biscuit","a biscuit","I want a biscuit.","I want one more biscuit.","Can I have a biscuit?"],"a round biscuit with chocolate chips on a small plate"),
V("soup","soup","🍲","food",["soup","hot soup","I want soup.","The soup is hot.","Can I have soup, please?"],"a bowl of soup with steam rising and a spoon"),
V("egg","egg","🥚","food",["egg","an egg","I want an egg.","I want a boiled egg.","Can I have an egg?"],"a boiled egg cut in half on a plate"),
V("pizza","pizza","🍕","food",["pizza","want pizza","I want pizza.","I want cheese pizza.","Can I have pizza, please?"],"a slice of cheese pizza on a plate"),
// My body
V("head","head","🙆","body",["head","my head","This is my head.","I touch my head.","Where is your head?"],"the boy pointing to the top of his head"),
V("eyes","eyes","👀","body",["eyes","my eyes","These are my eyes.","I close my eyes.","Where are your eyes?"],"the girl pointing to her eyes, close up of her face"),
V("ears","ears","👂","body",["ears","my ears","These are my ears.","I hear with my ears.","Where are your ears?"],"the boy holding both ears, smiling"),
V("mouth","mouth","👄","body",["mouth","my mouth","This is my mouth.","I open my mouth.","Where is your mouth?"],"the girl pointing to her open mouth"),
V("nose","nose","👃","body",["nose","my nose","This is my nose.","I touch my nose.","Where is your nose?"],"the boy touching his nose with one finger"),
V("hands","hands","🙌","body",["hands","my hands","These are my hands.","I wash my hands.","Where are your hands?"],"the girl holding up both hands, palms out"),
V("feet","feet","🦶","body",["feet","my feet","These are my feet.","I stamp my feet.","Where are your feet?"],"the boy sitting on the floor pointing at his bare feet"),
V("tummy","tummy","🫃","body",["tummy","my tummy","This is my tummy.","My tummy is full.","Does your tummy hurt?"],"the girl patting her tummy with both hands, smiling"),
// Things at home
V("cup","cup","🥤","objects",["cup","my cup","I want my cup.","I want the blue cup.","Where is my cup?"],"a blue plastic cup on a table"),
V("plate","plate","🍽️","objects",["plate","my plate","This is my plate.","My plate is empty.","Where is my plate?"],"an empty white plate on a table"),
V("spoon","spoon","🥄","objects",["spoon","a spoon","I need a spoon.","I eat with a spoon.","Can I have a spoon?"],"a metal spoon on a table"),
V("chair","chair","🪑","objects",["chair","my chair","I sit on the chair.","I sit on the red chair.","Where is my chair?"],"a small red wooden chair"),
V("table","table","🪑","objects",["table","the table","The cup is on the table.","The cup is on the big table.","Where is the table?"],"a wooden dining table with a cup on it"),
V("door","door","🚪","objects",["door","the door","Open the door.","Please open the door.","Can you open the door?"],"a closed front door with a round handle"),
V("bed","bed","🛏️","objects",["bed","my bed","I sleep in my bed.","I sleep in my soft bed.","Can I go to bed?"],"a child's bed with a blue blanket and pillow"),
V("shoes","shoes","👟","objects",["shoes","my shoes","I put on my shoes.","I put on my blue shoes.","Where are my shoes?"],"a pair of blue trainers side by side"),
V("ball","ball","⚽","objects",["ball","my ball","I want my ball.","I want the big ball.","Where is my ball?"],"a football on the grass"),
V("book","book","📕","objects",["book","my book","I read my book.","I read my book in bed.","Can you read my book?"],"a red picture book, closed, on a table"),
V("car","car","🚗","objects",["car","Daddy's car","I go in the car.","I go in Daddy's car.","Can we go in the car?"],"a family car, side view, parked"),
V("bus","bus","🚌","objects",["bus","big bus","I see a bus.","I see a big yellow bus.","Where is the bus?"],"a yellow school bus, side view"),
V("house","house","🏠","objects",["house","my house","This is my house.","My house has a red door.","Where is my house?"],"a small family house with a blue roof and a red door"),
V("hat","hat","🧢","objects",["hat","my hat","I put on my hat.","I put on my blue hat.","Where is my hat?"],"a blue baseball cap"),
// Animals
V("dog","dog","🐶","animals",["dog","big dog","I see a dog.","I see a big dog.","Where is the dog?"],"a friendly brown dog sitting, tongue out"),
V("cat","cat","🐱","animals",["cat","small cat","I see a cat.","I see a small cat.","Where is the cat?"],"a grey cat sitting with its tail curled"),
V("lion","lion","🦁","animals",["lion","big lion","I see a lion.","I see a big lion.","Where is the lion?"],"a lion with a full mane standing on grass"),
V("elephant","elephant","🐘","animals",["elephant","big elephant","I see an elephant.","I see a big grey elephant.","Where is the elephant?"],"a grey elephant with trunk raised"),
V("monkey","monkey","🐵","animals",["monkey","funny monkey","I see a monkey.","I see a monkey in a tree.","Where is the monkey?"],"a monkey hanging from a tree branch"),
V("goat","goat","🐐","animals",["goat","the goat","I see a goat.","I see a white goat eating.","Where is the goat?"],"a white goat standing on grass"),
V("bird","bird","🐦","animals",["bird","blue bird","I see a bird.","I see a bird flying.","Where is the bird?"],"a small blue bird on a branch"),
V("fish","fish","🐟","animals",["fish","orange fish","I see a fish.","I see a fish swimming.","Where is the fish?"],"an orange fish swimming in clear water"),
V("horse","horse","🐴","animals",["horse","brown horse","I see a horse.","I see a horse running.","Where is the horse?"],"a brown horse standing in a field"),
V("cow","cow","🐮","animals",["cow","the cow","I see a cow.","I see a cow eating grass.","Where is the cow?"],"a black and white cow standing on grass"),
// Actions
V("eat","eat","🍽️","actions",["eat","I eat","I can eat.","I eat with a spoon.","Can I eat now?"],"the boy eating rice with a spoon at a table",{f:"Find eat."}),
V("drink","drink","🥤","actions",["drink","I drink","I can drink.","I drink cold water.","Can I have a drink?"],"the girl drinking from a cup with both hands",{f:"Find drink."}),
V("run","run","🏃","actions",["run","I run","I can run.","I can run fast.","Can you run?"],"the boy running across the grass, arms pumping",{f:"Find run."}),
V("jump","jump","🤸","actions",["jump","I jump","I can jump.","I can jump high.","Can you jump?"],"the girl jumping in the air with both feet off the ground",{f:"Find jump."}),
V("sit","sit","🪑","actions",["sit","sit down","I sit down.","I sit on the chair.","Can I sit here?"],"the boy sitting on a small chair, hands on knees",{f:"Find sit."}),
V("stand","stand","🧍","actions",["stand","stand up","I stand up.","I stand up tall.","Can you stand up?"],"the girl standing up straight, arms by her sides",{f:"Find stand."}),
V("sleep","sleep","😴","actions",["sleep","I sleep","I can sleep.","I sleep in my bed.","Can I go to sleep?"],"the boy asleep in bed under a blanket",{f:"Find sleep."}),
V("wash","wash","🧼","actions",["wash","wash hands","I wash my hands.","I wash my hands with soap.","Can I wash my hands?"],"the girl washing her hands at a sink with soap bubbles",{f:"Find wash."}),
V("throw","throw","🤾","actions",["throw","throw ball","I throw the ball.","I throw the ball to Daddy.","Can you throw it?"],"the boy throwing a ball overarm",{f:"Find throw."}),
V("play","play","🧸","actions",["play","I play","I want to play.","I want to play outside.","Can I play now?"],"the girl playing with building blocks on the floor",{f:"Find play."}),
// Feelings
V("happy","happy","😀","feelings",["happy","I'm happy","I feel happy.","I feel happy today.","Are you happy?"],"the boy with a big happy smile, arms up",{f:"Find happy."}),
V("sad","sad","😢","feelings",["sad","I'm sad","I feel sad.","I feel sad right now.","Are you sad?"],"the girl looking sad with a tear, head down",{f:"Find sad."}),
V("angry","angry","😠","feelings",["angry","I'm angry","I feel angry.","I feel angry right now.","Are you angry?"],"the boy frowning with crossed arms, angry",{f:"Find angry."}),
V("tired","tired","🥱","feelings",["tired","I'm tired","I feel tired.","I feel tired. I want to rest.","Are you tired?"],"the girl yawning and rubbing one eye, tired",{f:"Find tired."}),
V("scared","scared","😨","feelings",["scared","I'm scared","I feel scared.","I feel scared of the dark.","Are you scared?"],"the boy hugging himself with wide eyes, scared",{f:"Find scared."}),
V("excited","excited","🤩","feelings",["excited","I'm excited","I feel excited.","I feel excited to play.","Are you excited?"],"the girl bouncing with sparkling eyes and open mouth, excited",{f:"Find excited."}),
V("hurt","hurt","🤕","feelings",["hurt","it hurts","I am hurt.","My knee hurts.","Can you help? It hurts."],"the boy holding his knee with a plaster on it, wincing",{f:"Find hurt."}),
// Describing words
V("big","big","🐘","describe",["big","big dog","The dog is big.","The dog is very big.","Is it big?"],"a very big dog standing next to a small cup for scale",{f:"Find big."}),
V("small","small","🐭","describe",["small","small cat","The cat is small.","The cat is very small.","Is it small?"],"a tiny kitten sitting inside a big cup",{f:"Find small."}),
V("hot","hot","🔥","describe",["hot","too hot","The soup is hot.","The soup is too hot.","Is it hot?"],"a bowl of soup with lots of steam rising",{f:"Find hot."}),
V("cold","cold","🧊","describe",["cold","cold water","The water is cold.","The water is very cold.","Is it cold?"],"a glass of water with ice cubes",{f:"Find cold."}),
V("wet","wet","💦","describe",["wet","wet dog","The dog is wet.","The dog is wet from the rain.","Is it wet?"],"a dripping wet dog standing in the rain",{f:"Find wet."}),
V("dry","dry","🧺","describe",["dry","dry towel","The towel is dry.","The towel is warm and dry.","Is it dry?"],"a folded fluffy towel in sunshine",{f:"Find dry."}),
V("clean","clean","✨","describe",["clean","clean hands","My hands are clean.","My hands are clean now.","Are they clean?"],"two clean hands held up with a little sparkle",{f:"Find clean."}),
V("dirty","dirty","🟤","describe",["dirty","dirty hands","My hands are dirty.","My hands are dirty from mud.","Are they dirty?"],"two muddy hands held up",{f:"Find dirty."}),
// Places
V("home","home","🏠","places",["home","go home","I go home.","I want to go home.","Can we go home?"],"a small house with a red door and a garden",{f:"Find home."}),
V("school","school","🏫","places",["school","go school","I go to school.","I go to school in the morning.","Is it time for school?"],"a school building with a sign and a flag"),
V("bathroom","bathroom","🚽","places",["bathroom","go bathroom","I need the bathroom.","I need the bathroom now.","Can I go to the bathroom?"],"a bathroom with a toilet and a sink"),
V("kitchen","kitchen","🍳","places",["kitchen","in kitchen","Mummy is in the kitchen.","Mummy is cooking in the kitchen.","Where is the kitchen?"],"a kitchen with a cooker, pots and a window"),
V("park","park","🌳","places",["park","go park","I go to the park.","I want to go to the park.","Can we go to the park?"],"a park with trees, a path and a bench"),
V("shop","shop","🛒","places",["shop","go shop","I go to the shop.","I go to the shop with Daddy.","Can we go to the shop?"],"a small shop front with fruit outside and a trolley"),
V("playground","playground","🛝","places",["playground","go playground","I go to the playground.","I play at the playground.","Can we go to the playground?"],"a playground with a slide and swings"),
// Positions
V("in","in","📥","positions",["in","in the box","The ball is in the box.","The red ball is in the box.","Is it in the box?"],"a ball inside an open cardboard box",{f:"Find in."}),
V("out","out","📤","positions",["out","out of the box","The ball is out of the box.","The ball is out, next to the box.","Is it out of the box?"],"a ball on the floor next to an empty open box",{f:"Find out."}),
V("on","on","⬆️","positions",["on","on the table","The cup is on the table.","The blue cup is on the table.","Is it on the table?"],"a cup sitting on top of a table",{f:"Find on."}),
V("under","under","⬇️","positions",["under","under the table","The cat is under the table.","The cat is hiding under the table.","Is it under the table?"],"a cat sitting underneath a table",{f:"Find under."}),
V("up","up","☝️","positions",["up","up high","The bird is up high.","The bird is up in the tree.","Is it up?"],"a bird high up in a tree, viewer looking up",{f:"Find up."}),
V("down","down","👇","positions",["down","down low","The ball is down there.","The ball rolled down the hill.","Is it down?"],"a ball at the bottom of a grassy hill",{f:"Find down."}),
// Being with people
V("hello","hello","👋","social",["hello","hello Mummy","Hello, how are you?","Hello, nice to meet you.","Hello, what is your name?"],"the boy waving hello with a big smile",{f:"Find hello."}),
V("goodbye","goodbye","🚶","social",["goodbye","bye Daddy","Goodbye, see you soon.","Goodbye, see you tomorrow.","Are you going now? Goodbye."],"the girl waving goodbye at a door as Dad leaves",{f:"Find goodbye."}),
V("please","please","🙏","social",["please","yes please","More, please.","Can I have water, please?","Please, can you help me?"],"the boy with hands together, asking politely",{f:"Find please."}),
V("thank_you","thank you","🤗","social",["thank you","thank you Mummy","Thank you for the juice.","Thank you, I like it.","Did you say thank you?"],"the girl holding a gift box, smiling at Mum",{f:"Find thank you."}),
V("yes","yes","👍","social",["yes","yes please","Yes, I want it.","Yes, I want to play.","Is it a yes?"],"the boy nodding with a thumbs up",{f:"Find yes."}),
V("no","no","👎","social",["no","no thank you","No, I don't want it.","No, I don't want that one.","Is it a no?"],"the girl shaking her head with a palm out",{f:"Find no."}),
V("my_turn","my turn","🔁","social",["my turn","it's my turn","It is my turn now.","It is my turn to play.","Is it my turn?"],"the boy and girl with a toy car, the boy pointing at himself",{f:"Find my turn."}),
// Colours and numbers
V("red","red","🔴","colours",["red","red car","I see a red car.","I see a big red car.","Which one is red?"],"a bright red toy car",{f:"Find red."}),
V("blue","blue","🔵","colours",["blue","blue cup","I see a blue cup.","I see a blue cup on the table.","Which one is blue?"],"a bright blue cup",{f:"Find blue."}),
V("green","green","🟢","colours",["green","green apple","I see a green apple.","I see a green apple on the plate.","Which one is green?"],"a bright green apple",{f:"Find green."}),
V("yellow","yellow","🟡","colours",["yellow","yellow hat","I see a yellow hat.","I see a big yellow hat.","Which one is yellow?"],"a bright yellow sun hat",{f:"Find yellow."}),
V("orange","orange","🟠","colours",["orange","orange ball","I see an orange ball.","I see an orange ball bouncing.","Which one is orange?"],"a bright orange ball",{f:"Find orange."}),
V("purple","purple","🟣","colours",["purple","purple shoes","I see purple shoes.","I see purple shoes by the door.","Which one is purple?"],"a pair of bright purple shoes",{f:"Find purple."}),
V("one","one","1️⃣","colours",["one","one ball","I see one ball.","I see one ball on the grass.","How many? One."],"a single football on grass",{f:"Find one."}),
V("two","two","2️⃣","colours",["two","two balls","I see two balls.","I see two balls on the grass.","How many? Two."],"two footballs side by side on grass",{f:"Find two."}),
V("three","three","3️⃣","colours",["three","three apples","I see three apples.","I see three apples on the plate.","How many? Three."],"three red apples in a row on a plate",{f:"Find three."}),
V("four","four","4️⃣","colours",["four","four cups","I see four cups.","I see four cups on the table.","How many? Four."],"four blue cups in a row on a table",{f:"Find four."}),
];
VOCAB.forEach(v=>{v.q=v.q||VOCAB_Q[v.cat];v.f=v.f||("Find the "+v.w+".");v.img="v_"+v.id});

// Needs board: one tap speaks it. Never scored. The "I want" tile opens the child's favourite things.
const NEEDS=[
  {id:"help",label:"help",e:"🙋",say:"I need help."},
  {id:"stop",label:"stop",e:"✋",say:"Stop, please."},
  {id:"more",label:"more",e:"➕",say:"I want more."},
  {id:"all_done",label:"all done",e:"✅",say:"I am all done."},
  {id:"hurt",label:"it hurts",e:"🤕",say:"I am hurt."},
  {id:"bathroom",label:"bathroom",e:"🚽",say:"I need the bathroom."},
  {id:"drink",label:"drink",e:"🥤",say:"I want a drink."},
  {id:"eat",label:"eat",e:"🍽️",say:"I am hungry."},
  {id:"break",label:"break",e:"🛋️",say:"I need a break."},
  {id:"want",label:"I want…",e:"👉",sub:["water","juice","milk","biscuit","banana","apple","ball","book","play","bed"]},
];

// What Happens Next: everyday sequences in order. Each step has a caption and a picture prompt.
const SEQUENCES=[
  {id:"hands",name:"Washing hands",steps:[["Turn on the tap.","the girl turning on a tap at a sink"],["Wash with soap.","the girl rubbing soapy hands together at the sink"],["Dry your hands.","the girl drying her hands on a towel"]]},
  {id:"teeth",name:"Brushing teeth",steps:[["Put toothpaste on the brush.","the boy squeezing toothpaste onto a toothbrush"],["Brush your teeth.","the boy brushing his teeth at a sink"],["Rinse and spit.","the boy rinsing with a cup of water at the sink"]]},
  {id:"shoes",name:"Putting on shoes",steps:[["Get your shoes.","the girl holding a pair of blue trainers"],["Put your shoes on.","the girl sitting on a step pushing her foot into a trainer"],["Go outside.","the girl walking out of the front door into sunshine"]]},
  {id:"eat",name:"Eating dinner",steps:[["Sit at the table.","the boy sitting at a dining table with an empty plate"],["Eat your food.","the boy eating rice and chicken with a spoon"],["All done.","the boy pushing away an empty plate, smiling"]]},
  {id:"bed",name:"Going to bed",steps:[["Put on pyjamas.","the girl in pyjamas holding a teddy"],["Get into bed.","the girl climbing into bed"],["Go to sleep.","the girl asleep in bed with the light off"]]},
  {id:"school",name:"Going to school",steps:[["Put on your bag.","the boy putting a backpack on his shoulders"],["Get in the car.","the boy climbing into the back seat of a car"],["Go into school.","the boy walking through the school gate"]]},
  {id:"bath",name:"Having a bath",steps:[["Fill the bath.","a bath filling with water and bubbles"],["Wash in the bath.","the boy in the bath with bubbles, washing"],["Dry with a towel.","the boy wrapped in a big towel"]]},
  {id:"juice",name:"Getting a drink",steps:[["Open the fridge.","the girl opening a fridge door"],["Pour the juice.","the girl pouring juice into a cup"],["Drink the juice.","the girl drinking juice from the cup"]]},
];

// Understand Feelings: who shows it, and the model sentences.
const FEELINGS=["happy","sad","angry","tired","scared","excited","hurt"];
const FEEL_WHO=[{id:"boy",w:"he",name:"the boy",p:"the boy"},{id:"girl",w:"she",name:"the girl",p:"the girl"}];

// Follow Instructions: three stages. 1 object, 2 colour + object, 3 position, plus two-step at any stage.
const DO_OBJECTS=["ball","cup","book","apple","banana","shoes","spoon","dog","cat","chair"];
const DO_COLOURS=[{c:"red",e:"🔴"},{c:"blue",e:"🔵"},{c:"green",e:"🟢"},{c:"yellow",e:"🟡"}];
const DO_COLOUR_OBJECTS=["ball","cup","car"];   // pictures: c_<colour>_<object>
const DO_POSITIONS=[{p:"in the box",e:"📥",id:"in"},{p:"on the box",e:"⬆️",id:"on"},{p:"under the box",e:"⬇️",id:"under"},{p:"next to the box",e:"↔️",id:"beside"}];   // pictures: pos_ball_<id>

if(typeof module!=="undefined")module.exports={VOCAB,VOCAB_CATS,VOCAB_Q,NEEDS,SEQUENCES,FEELINGS,FEEL_WHO,DO_OBJECTS,DO_COLOURS,DO_COLOUR_OBJECTS,DO_POSITIONS};
