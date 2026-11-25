/* Riepilogo delle lezioni 9-16 (L. Molteni): mappe mentali e quiz misto */
MAPPA['116']={c:'Dalla domanda di business alla decisione',r:[
  {t:'Domanda e dati (9)',c:BLUE,v:['Target e KPI','Warehouse affidabile','Predittiva e generativa']},
  {t:'Esplorare (10)',c:YEL,v:['Tipi di variabile','χ², r, ANOVA','KNIME']},
  {t:'Preparare (11)',c:PUR,v:['Mancanti, anomali','Leakage','Feature, codifica, scala']},
  {t:'Modellare (13)',c:GRN,v:['Albero, foresta, boosting','Importanza: tagli, SHAP, PD']},
  {t:'Valutare (12, 14)',c:PINK,v:['Test mai visto','Matrice, AUC, lift','Risultati troppo belli']},
  {t:'Decidere (14, 16)',c:ORG,v:['Soglia sui costi','Lista grande quanto la capacità']},
  {t:'Testi e immagini (15, 16)',c:TEAL,v:['Bag of words, LDA','Otsu, segmenti, tessitura']}]};
MAPPA['116a']={c:'Leggere i dati',r:[
  {t:'Tipi',c:PINK,v:['Nominali, ordinali','Discrete, continue','Intervalli, rapporti']},
  {t:'Una variabile',c:YEL,v:['Media, mediana, moda','IQR, deviazione standard, CV','Asimmetria, curtosi']},
  {t:'Test',c:ORG,v:['H₀ e H₁','p-value minore di α: rifiuto','Errori di I e II tipo']},
  {t:'Due variabili',c:GRN,v:['Qualitative: χ², V','Quantitative: r, test t','Miste: ANOVA, F']}]};
MAPPA['116b']={c:'Preparare i dati',r:[
  {t:'Mancanti',c:PUR,v:['MCAR, MAR, MNAR, strutturali','Cancellare, imputare, segnalare','Travestiti: NA, NULL']},
  {t:'Anomali',c:RED,v:['Errore o valore vero?','Regola 1,5 IQR, per gruppo','Limitare o trasformare']},
  {t:'Leakage',c:ORG,v:['Quando è misurata la colonna?','Modello perfetto: allarme']},
  {t:'Feature',c:GRN,v:['One-hot, ordinale','Min-max, z-score','Indicatori, gruppi, tassi']}]};
MAPPA['116c']={c:'Valutare',r:[
  {t:'Dati',c:BLUE,v:['Training, validazione, test','Stratificare, fissare il seme','Validazione incrociata']},
  {t:'Classi',c:GRN,v:['Sensibilità, specificità','Precisione, F1','κ, MCC, acc. bilanciata']},
  {t:'Classifica',c:PINK,v:['Soglia','ROC e AUC','Gain e lift']},
  {t:'Numeri',c:YEL,v:['MAE, RMSE','MAPE, MPE','R², MASE']}]};
MAPPA['116d']={c:'Scegliere il modello',r:[
  {t:'Albero',c:GRN,v:['Gini, entropia, gain ratio','Potatura MDL','Regole leggibili, instabile']},
  {t:'Foresta',c:BLUE,v:['Bootstrap, √p variabili','Media: meno varianza']},
  {t:'Boosting',c:PINK,v:['Alberi sui residui','Tasso 0,1, profondità 4-6','Meno distorsione, va regolato']},
  {t:'Importanza',c:ORG,v:['Statistiche dei tagli','SHAP','Dipendenza parziale']}]};
MAPPA['116e']={c:'Dal modello alla decisione',r:[
  {t:'Soglia',c:ORG,v:['Costo = FN·c(FN) + FP·c(FP)','Caso mancato caro: soglia bassa']},
  {t:'Capacità',c:YEL,v:['Ordinare per probabilità','Tagliare a k casi','Gruppo di controllo']},
  {t:'Sospetti',c:RED,v:['Primo taglio','Semi, bilanciamento, test usato']},
  {t:'Testi',c:TEAL,v:['Pulire, bag of words','Dizionario, foresta, LDA']},
  {t:'Immagini',c:BLUE,v:['Otsu, segmenti','Primo ordine, forma, tessitura']}]};
QZ['116']=()=>[
  {q:'Vuoi sapere se il tipo di contratto (mensile, annuale, biennale) è legato all\'abbandono (sì o no). Quale strumento usi, e come misuri la forza del legame?',o:['Correlazione di Pearson e r','Tabella di contingenza con test χ², e V di Cramér','ANOVA e F','Regressione lineare e R²'],a:1,
   e:'Due variabili qualitative: tabella di contingenza e test χ² per l\'esistenza del legame, V di Cramér per la forza (nel caso Telco 0,41, alta).',h:'Di che tipo sono le due variabili?'},
  {q:'In un dataset il reddito manca soprattutto per chi guadagna poco, che non vuole dichiararlo. Che cosa conviene fare?',o:['Cancellare le righe senza reddito','Imputare la media del reddito','Aggiungere un indicatore o una categoria «non dichiarato»: la mancanza è MNAR e porta informazione','Imputare zero'],a:2,
   e:'La probabilità di mancare dipende dal valore stesso: cancellare o imputare la media distorcerebbe il quadro, l\'indicatore conserva il segnale.',h:'Da che cosa dipende la mancanza?'},
  {q:'Un modello di abbandono ha accuratezza 0,97 sul test, e il primo taglio dell\'albero è «numero di conti chiusi nell\'ultimo mese». Che cosa pensi?',o:['Ottimo modello, si può usare subito','Leakage: la colonna è misurata dopo l\'evento che si vuole prevedere','Serve più potatura','Bisogna aumentare il numero di alberi'],a:1,
   e:'Un conto chiuso è parte dell\'abbandono stesso: il modello legge la risposta. È il caso delle colonne post-evento della banca nella lezione 14.',h:'Quando è misurata quella colonna?'},
  {q:'Con TP = 40, FN = 10, FP = 20, TN = 130, quanto valgono sensibilità e precisione?',o:['0,80 e 0,667','0,667 e 0,80','0,85 e 0,867','0,80 e 0,867'],a:0,
   e:'Sensibilità = 40 / (40 + 10) = 0,80; precisione = 40 / (40 + 20) = 0,667. 0,85 è l\'accuratezza, 0,867 la specificità.',h:'Sensibilità guarda i positivi veri, precisione i previsti positivi.'},
  {q:'Su un dataset con il 2% di frodi, un modello dichiara tutto «legittimo». Quali indici smascherano subito che è inutile?',o:['Accuratezza e tasso di errore','Sensibilità, accuratezza bilanciata e κ di Cohen','Solo la specificità','Il MAPE'],a:1,
   e:'Accuratezza 98%, ma sensibilità 0, accuratezza bilanciata 0,5 e κ 0: gli indici robusti alle classi sbilanciate rivelano che non trova nessuna frode.',h:'Quali indici guardano la classe rara?'},
  {q:'Quale coppia descrive correttamente random forest e gradient boosting?',o:['Foresta: alberi in sequenza sui residui; boosting: media di alberi indipendenti','Foresta: media di alberi profondi su campioni bootstrap, riduce la varianza; boosting: alberi bassi in sequenza sui residui, riduce la distorsione','Tutti e due riducono solo la distorsione','Il boosting non ha parametri da regolare'],a:1,
   e:'È la distinzione centrale della lezione 13: parallelo e media contro sequenza e correzioni.',h:'Quale errore attacca ciascuno?'},
  {q:'Un pezzo difettoso non scoperto costa 150 euro, un controllo a mano 5 euro. Abbassando la soglia da 0,5 a 0,35 i difetti mancati per 1.000 pezzi scendono da circa 6,7 a 2,2, i controlli salgono da circa 107 a 132. Conviene?',o:['No, i controlli aumentano','Sì: il costo scende da circa 1.533 a circa 994 euro','È indifferente','Non si può dire senza l\'AUC'],a:1,
   e:'0,5: 6,7 × 150 + 107 × 5 ≈ 1.000 + 533 = 1.533 euro. 0,35: 2,2 × 150 + 132 × 5 ≈ 333 + 661 = 994 euro. Il costo atteso scende del 35%.',h:'Moltiplica ogni errore per il suo costo e somma.'},
  {q:'Che cosa hanno in comune l\'analisi dei tweet e quella delle immagini dei pezzi?',o:['Usano entrambe le reti convoluzionali','Trasformano i dati non tabellari in una tabella di colonne numeriche, su cui valgono i modelli e gli indici delle lezioni 12-14','Non richiedono etichette','Usano entrambe il test χ²'],a:1,
   e:'Bag of words per i testi, feature di primo ordine, forma e tessitura per le immagini: poi è una tabella come le altre, con divisione, random forest, Scorer e soglia.',h:'Che cosa diventa un testo o un\'immagine prima del modello?'}
];
