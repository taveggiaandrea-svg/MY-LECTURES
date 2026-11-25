/* Riepilogo delle lezioni 1-8 (A. Rezzani): mappe mentali e quiz misto */
INIT[108]=function(){codeHL($('#lezione-108'))};
MAPPA['108']={c:'Dove stanno i dati, e come si interrogano?',r:[
  {t:'1 · Evoluzione',c:BLUE,v:['Report sul database operativo','Warehouse, OLAP, data mining, Big Data','ETL e BI']},
  {t:'2-3 · SQL',c:YEL,v:['Tabelle, chiavi, normalizzazione','SELECT, join, GROUP BY','NULL, sottoquery, funzioni finestra']},
  {t:'4 · NoSQL',c:PINK,v:['Scalare in orizzontale','ACID contro BASE','Key-value, documenti, colonne, grafi']},
  {t:'5 · Hadoop',c:ORG,v:['HDFS: blocchi e repliche','MapReduce: map, shuffle, reduce','YARN, Hive, l\'ecosistema']},
  {t:'6-7 · Spark',c:GRN,v:['In memoria, DAG pigro','RDD e DataFrame','Streaming, grafi, MLlib']},
  {t:'8 · Data lake',c:TEAL,v:['Dati grezzi, schema on read','Accanto al warehouse','Governance o palude']}]};
MAPPA['108a']={c:'Dati per decidere',r:[
  {t:'Operativo',c:BLUE,v:['ERP, CRM','Scritture veloci, normalizzato','Dato attuale']},
  {t:'Warehouse',c:YEL,v:['Integrato e ripulito','Fatti e dimensioni','Unica fonte di verità']},
  {t:'ETL e BI',c:ORG,v:['Estrarre, trasformare, caricare','Report, OLAP, cruscotti']},
  {t:'Data lake',c:TEAL,v:['Grezzo, ogni formato','Schema on read','Distillazione verso il warehouse']}]};
MAPPA['108b']={c:'SQL',r:[
  {t:'Tabelle',c:YEL,v:['Chiave primaria ed esterna','NOT NULL, CHECK','1NF, 3NF']},
  {t:'Interrogare',c:BLUE,v:['FROM, WHERE, GROUP BY','HAVING, SELECT, ORDER BY']},
  {t:'Combinare',c:PINK,v:['INNER, LEFT, RIGHT, FULL','UNION e UNION ALL','EXISTS']},
  {t:'NULL',c:PUR,v:['Confronti: UNKNOWN','IS NULL, COALESCE','COUNT(*) conta tutto']},
  {t:'Finestre',c:TEAL,v:['OVER (PARTITION BY, ORDER BY)','ROWS BETWEEN','LAG, LEAD, ROW_NUMBER']}]};
MAPPA['108c']={c:'Quando una macchina non basta',r:[
  {t:'Distribuire',c:BLUE,v:['Nodi, rack, cluster','Scalabilità orizzontale']},
  {t:'Garanzie',c:YEL,v:['ACID: tutto o niente','BASE: coerenza alla fine']},
  {t:'NoSQL',c:PINK,v:['Key-value, documenti','Colonne (HBase), grafi (Neo4j)']},
  {t:'HDFS',c:ORG,v:['Blocchi da 128 MB','Replica 3, rack awareness','Name node e data node']},
  {t:'MapReduce',c:GRN,v:['Map, shuffle, reduce','Il calcolo va dai dati','Batch, non interattivo']}]};
MAPPA['108d']={c:'Spark',r:[
  {t:'Architettura',c:BLUE,v:['Driver e SparkSession','Executor e task','YARN, local[*]']},
  {t:'RDD',c:YEL,v:['Partizioni immutabili','Trasformazioni pigre, azioni','DAG, stage, shuffle']},
  {t:'DataFrame e SQL',c:GRN,v:['Colonne con schema','filter, groupBy, vista temporanea']},
  {t:'Stack',c:PINK,v:['Structured Streaming','GraphFrames','MLlib e pipeline']}]};
QZ['108']=()=>[
  {q:'Un\'analista vuole confrontare le vendite mensili degli ultimi dieci anni per regione, senza rallentare il sistema degli ordini. Dove dovrebbe lavorare?',o:['Sul database operativo, che ha i dati più aggiornati','Sul data warehouse, integrato e pensato per l\'analisi','Su un key-value store','Su un file CSV esportato a mano ogni mese'],a:1,
   e:'Il warehouse contiene lo storico integrato e ripulito, con dati aggregati, ed è separato dal sistema operativo: le analisi non competono con le transazioni.',h:'Ricorda i tre problemi dell\'analisi sul database operativo (lezione 1).'},
  {q:'Una query ha WHERE SUM(quantity) &gt; 10 e dà errore. Perché?',o:['SUM non esiste in SQL','WHERE filtra le righe prima del raggruppamento: una condizione su un\'aggregazione va in HAVING','Manca ORDER BY','quantity è NULL'],a:1,
   e:'Nell\'ordine logico WHERE viene prima di GROUP BY, quindi non può vedere le aggregazioni; HAVING filtra i gruppi dopo.',h:'Guarda la tabella dell\'ordine logico.'},
  {q:'La tabella Customers ha 5 clienti, di cui 2 senza vendite. Quante righe di clienti restituisce SELECT ... FROM Customers c INNER JOIN Sales s ON ... GROUP BY c.customer_id?',o:['5','3','2','0'],a:1,
   e:'L\'inner join tiene solo i clienti con almeno una vendita: 3. Per tenere tutti e 5 serve un LEFT JOIN, con i totali NULL (o 0 con COALESCE) per gli altri due.',h:'Che cosa fa l\'inner join alle righe senza partner?'},
  {q:'Che cosa restituisce SELECT COUNT(*), COUNT(city) su una tabella di 6 righe in cui city è NULL in 2 righe?',o:['6 e 6','4 e 4','6 e 4','4 e 6'],a:2,
   e:'COUNT(*) conta le righe, NULL compresi; COUNT(colonna) ignora i NULL.',h:'Solo una delle due forme ignora i NULL.'},
  {q:'Un file di 640 MB va in HDFS con blocchi da 128 MB e replica 3. Quanti blocchi vengono memorizzati in tutto, e quanto spazio occupano?',o:['5 blocchi, 640 MB','15 blocchi, 1.920 MB','15 blocchi, 640 MB','3 blocchi, 384 MB'],a:1,
   e:'640 / 128 = 5 blocchi, ciascuno copiato 3 volte: 15 blocchi, 640 × 3 = 1.920 MB.',h:'Prima i blocchi, poi moltiplica per la replica.'},
  {q:'In un programma Spark, quale riga fa partire davvero il calcolo?',o:['rdd.flatMap(...)','rdd.map(...)','counts.reduceByKey(...)','counts.collect()'],a:3,
   e:'flatMap, map e reduceByKey sono trasformazioni: allungano il DAG senza calcolare. collect è un\'azione e lo esegue.',h:'Trasformazioni o azioni?'},
  {q:'Una banca deve registrare un bonifico che toglie da un conto e aggiunge a un altro. Quale garanzia serve, e quale famiglia di database?',o:['BASE, un database di documenti','ACID, un database relazionale (o un sistema con transazioni ACID)','Nessuna, basta la replica di HDFS','Eventual consistency, un key-value store'],a:1,
   e:'Un bonifico non può restare a metà: serve l\'atomicità (tutto o niente) e la durabilità delle garanzie ACID.',h:'Che cosa succede se il sistema si ferma fra le due operazioni?'},
  {q:'Un\'azienda vuole conservare per anni log dei clic, immagini e recensioni, senza sapere ancora come li analizzerà. Che cosa propone la lezione 8?',o:['Normalizzarli in 3NF nel warehouse','Un data lake, con schema on read, accanto al warehouse','Cancellarli dopo un mese','Un cubo OLAP'],a:1,
   e:'Il lago tiene dati grezzi di ogni formato a basso costo e lascia decidere lo schema al momento della lettura; i risultati distillati possono poi passare nel warehouse.',h:'Schema on write o schema on read?'}
];
