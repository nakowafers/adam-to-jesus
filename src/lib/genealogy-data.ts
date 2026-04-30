export type LineageType = "main" | "royal" | "biological";

export interface Ancestor {
  id: string;
  name: string;
  title: string;
  summary: string;
  verse: string;
  verseReference: string;
  verseLink: string;
  lineage: LineageType;
  generation: number;
}

export const ancestors: Ancestor[] = [
  {
    id: "adam",
    name: "Adam",
    title: "The First Man",
    summary:
      "Adam was the first human being, created by God from the dust of the ground. He was placed in the Garden of Eden and became the father of all humanity. Through Adam, sin entered the world, but through his descendant Jesus, redemption would come.",
    verse:
      "This is the account of the creation of the heavens and the earth. When the LORD God made the earth and the heavens... then the LORD God formed the man from the dust of the ground.",
    verseReference: "Genesis 2:4-7 (NLT)",
    verseLink: "https://www.bible.com/bible/116/GEN.2.4-7.NLT",
    lineage: "main",
    generation: 1,
  },
  {
    id: "noah",
    name: "Noah",
    title: "The Ark Builder",
    summary:
      "Noah was a righteous man who found favor in God's eyes during a time of great wickedness. God chose him to build an ark and preserve humanity and animals through the great flood. He became the father of Shem, Ham, and Japheth.",
    verse:
      "Noah was a righteous man, the only blameless person living on earth at the time, and he walked in close fellowship with God.",
    verseReference: "Genesis 6:9 (NLT)",
    verseLink: "https://www.bible.com/bible/116/GEN.6.9.NLT",
    lineage: "main",
    generation: 2,
  },
  {
    id: "abraham",
    name: "Abraham",
    title: "Father of Nations",
    summary:
      "Abraham, originally named Abram, was called by God to leave his homeland and become the father of a great nation. God established a covenant with him, promising that all nations would be blessed through his descendants. He is considered the patriarch of the Jewish, Christian, and Islamic faiths.",
    verse:
      "The LORD had said to Abram, 'Leave your native country, your relatives, and your father's family, and go to the land that I will show you. I will make you into a great nation.'",
    verseReference: "Genesis 12:1-2 (NLT)",
    verseLink: "https://www.bible.com/bible/116/GEN.12.1-2.NLT",
    lineage: "main",
    generation: 3,
  },
  {
    id: "judah",
    name: "Judah",
    title: "The Lion's Tribe",
    summary:
      "Judah was the fourth son of Jacob and Leah. Though not the firstborn, he became the ancestor of the royal tribe of Israel. The Messiah was prophesied to come from his lineage, described as a lion—a symbol of strength and kingship.",
    verse:
      "Judah, your brothers will praise you. You will grasp your enemies by the neck. All your relatives will bow before you... The scepter will not depart from Judah.",
    verseReference: "Genesis 49:8-10 (NLT)",
    verseLink: "https://www.bible.com/bible/116/GEN.49.8-10.NLT",
    lineage: "main",
    generation: 4,
  },
  {
    id: "jesse",
    name: "Jesse",
    title: "Father of the King",
    summary:
      "Jesse was a prosperous sheep farmer from Bethlehem and the father of eight sons, including David. He is remembered as the root from which the Messiah would spring—the 'shoot from the stump of Jesse' prophesied by Isaiah.",
    verse:
      "Out of the stump of David's father Jesse, a shoot will grow—a Branch bearing fruit from the old root. And the Spirit of the LORD will rest on him.",
    verseReference: "Isaiah 11:1-2 (NLT)",
    verseLink: "https://www.bible.com/bible/116/ISA.11.1-2.NLT",
    lineage: "main",
    generation: 5,
  },
  {
    id: "david",
    name: "King David",
    title: "The Shepherd King",
    summary:
      "David was Israel's greatest king, a man after God's own heart. From shepherd boy to giant slayer to king, his life defined the messianic expectation. God promised that his throne would be established forever—a promise fulfilled in Jesus Christ.",
    verse:
      "David was the father of Solomon (whose mother had been Uriah's wife). Solomon was the father of Rehoboam.",
    verseReference: "Matthew 1:6-7 (NLT)",
    verseLink: "https://www.bible.com/bible/116/MAT.1.6-7.NLT",
    lineage: "main",
    generation: 6,
  },
  {
    id: "solomon",
    name: "King Solomon",
    title: "The Wise King",
    summary:
      "Solomon was David's son through Bathsheba and became Israel's wealthiest and wisest king. He built the first Temple in Jerusalem. Matthew traces Jesus' legal lineage through Solomon, establishing his right to David's throne.",
    verse:
      "Solomon was the father of Rehoboam. Rehoboam was the father of Abijah. Abijah was the father of Asa.",
    verseReference: "Matthew 1:7 (NLT)",
    verseLink: "https://www.bible.com/bible/116/MAT.1.7.NLT",
    lineage: "royal",
    generation: 7,
  },
  {
    id: "rehoboam",
    name: "Rehoboam",
    title: "The Divided Kingdom",
    summary:
      "Rehoboam was Solomon's son who became king after his father's death. His harsh policies led to the division of the kingdom into Israel (north) and Judah (south). He ruled Judah for 17 years.",
    verse:
      "Rehoboam was the father of Abijah. Abijah was the father of Asa.",
    verseReference: "Matthew 1:7 (NLT)",
    verseLink: "https://www.bible.com/bible/116/MAT.1.7.NLT",
    lineage: "royal",
    generation: 8,
  },
  {
    id: "abijah",
    name: "Abijah",
    title: "King of Judah",
    summary:
      "Abijah (also called Abijam) was king of Judah for three years. Despite following his father's sins, God preserved his line for David's sake and gave him victory over Jeroboam of Israel.",
    verse:
      "Abijah was the father of Asa. Asa was the father of Jehoshaphat.",
    verseReference: "Matthew 1:7-8 (NLT)",
    verseLink: "https://www.bible.com/bible/116/MAT.1.7-8.NLT",
    lineage: "royal",
    generation: 9,
  },
  {
    id: "zerubbabel-royal",
    name: "Zerubbabel",
    title: "Rebuilder of the Temple",
    summary:
      "Zerubbabel was a governor of Judah and a key leader in the return from Babylonian exile. He led the effort to rebuild the Temple in Jerusalem and is mentioned in both Matthew's and Luke's genealogies.",
    verse:
      "Shealtiel was the father of Zerubbabel. Zerubbabel was the father of Abiud.",
    verseReference: "Matthew 1:12-13 (NLT)",
    verseLink: "https://www.bible.com/bible/116/MAT.1.12-13.NLT",
    lineage: "royal",
    generation: 10,
  },
  {
    id: "jacob-royal",
    name: "Jacob",
    title: "Father of Joseph",
    summary:
      "Jacob was the father of Joseph, the legal father of Jesus. Through Joseph, Jesus inherited the legal right to David's throne, fulfilling the messianic prophecies about the royal line.",
    verse:
      "Jacob was the father of Joseph, the husband of Mary. Mary gave birth to Jesus, who is called the Messiah.",
    verseReference: "Matthew 1:16 (NLT)",
    verseLink: "https://www.bible.com/bible/116/MAT.1.16.NLT",
    lineage: "royal",
    generation: 11,
  },
  {
    id: "joseph",
    name: "Joseph",
    title: "The Righteous Carpenter",
    summary:
      "Joseph was the legal father of Jesus and husband of Mary. A righteous man descended from David through Solomon, he provided Jesus with the legal claim to David's throne while protecting Mary and raising Jesus as his own son.",
    verse:
      "Jacob was the father of Joseph, the husband of Mary. Mary gave birth to Jesus, who is called the Messiah.",
    verseReference: "Matthew 1:16 (NLT)",
    verseLink: "https://www.bible.com/bible/116/MAT.1.16.NLT",
    lineage: "royal",
    generation: 12,
  },
  {
    id: "nathan",
    name: "Nathan",
    title: "Son of David",
    summary:
      "Nathan was another son of David, born in Jerusalem. While Solomon's line carried the royal succession, Nathan's line—recorded in Luke's genealogy—traces the biological descent to Jesus through Mary, showing Jesus as both legal heir and blood descendant of David.",
    verse:
      "Jesus was known as the son of Joseph. Joseph was the son of Heli... Nathan was the son of David.",
    verseReference: "Luke 3:23, 31 (NLT)",
    verseLink: "https://www.bible.com/bible/116/LUK.3.23-31.NLT",
    lineage: "biological",
    generation: 7,
  },
  {
    id: "mattatha",
    name: "Mattatha",
    title: "Descendant of Nathan",
    summary:
      "Mattatha was the son of Nathan and grandson of King David. He appears in Luke's genealogy, continuing the biological line from David that would eventually lead to Mary, the mother of Jesus.",
    verse:
      "Mattatha was the son of Nathan. Nathan was the son of David.",
    verseReference: "Luke 3:31 (NLT)",
    verseLink: "https://www.bible.com/bible/116/LUK.3.31.NLT",
    lineage: "biological",
    generation: 8,
  },
  {
    id: "melea",
    name: "Melea",
    title: "In the Line of Mary",
    summary:
      "Melea appears in Luke's genealogy as part of the biological line from David through Nathan. This lineage traces the actual bloodline to Jesus through his mother Mary.",
    verse:
      "Melea was the son of Menna. Menna was the son of Mattatha.",
    verseReference: "Luke 3:31 (NLT)",
    verseLink: "https://www.bible.com/bible/116/LUK.3.31.NLT",
    lineage: "biological",
    generation: 9,
  },
  {
    id: "zerubbabel-bio",
    name: "Zerubbabel",
    title: "Post-Exile Leader",
    summary:
      "Zerubbabel appears in both genealogies as a key figure after the Babylonian exile. In Luke's genealogy, he connects the post-exile generations to the biological line leading to Mary.",
    verse:
      "Zerubbabel was the son of Shealtiel. Shealtiel was the son of Neri.",
    verseReference: "Luke 3:27 (NLT)",
    verseLink: "https://www.bible.com/bible/116/LUK.3.27.NLT",
    lineage: "biological",
    generation: 10,
  },
  {
    id: "heli",
    name: "Heli",
    title: "Father of Mary",
    summary:
      "Heli (also known as Joachim in tradition) is identified in Luke's genealogy as the father of Mary or father-in-law of Joseph. Through Heli, Jesus received his biological descent from David.",
    verse:
      "Jesus was known as the son of Joseph. Joseph was the son of Heli.",
    verseReference: "Luke 3:23 (NLT)",
    verseLink: "https://www.bible.com/bible/116/LUK.3.23.NLT",
    lineage: "biological",
    generation: 11,
  },
  {
    id: "mary",
    name: "Mary",
    title: "Mother of Jesus",
    summary:
      "Mary was a young virgin from Nazareth chosen by God to bear his Son. Through her, Jesus received his biological descent from David through Nathan, fulfilling prophecy that the Messiah would be of David's bloodline.",
    verse:
      "The angel replied, 'The Holy Spirit will come upon you, and the power of the Most High will overshadow you. So the baby to be born will be holy, and he will be called the Son of God.'",
    verseReference: "Luke 1:35 (NLT)",
    verseLink: "https://www.bible.com/bible/116/LUK.1.35.NLT",
    lineage: "biological",
    generation: 12,
  },
  {
    id: "jesus",
    name: "Jesus",
    title: "The Promised Messiah",
    summary:
      "Jesus Christ is the culmination of all genealogical prophecy—Son of David, Son of Abraham, Son of Adam, Son of God. Both Matthew's royal line through Joseph and Luke's biological line through Mary converge in Him, the Savior of the world.",
    verse:
      "This is a record of the ancestors of Jesus the Messiah, a descendant of David and of Abraham.",
    verseReference: "Matthew 1:1 (NLT)",
    verseLink: "https://www.bible.com/bible/116/MAT.1.1.NLT",
    lineage: "main",
    generation: 8,
  },
];

export const getAncestorById = (id: string): Ancestor | undefined => {
  return ancestors.find((ancestor) => ancestor.id === id);
};
