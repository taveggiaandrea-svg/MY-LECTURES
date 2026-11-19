/* Machine Learning: macro KaTeX, un colore per variabile (pesi gialli, input blu, output verdi, loss rosa, passi e iperparametri arancioni) */
{const mc=(n,x)=>R`\htmlClass{k-${n}}{${x}}`;
Object.assign(MAC,{
  '\\Ws':mc('yellow','w'),'\\Wv':mc('yellow',String.raw`\mathbf{w}`),'\\Mm':mc('yellow','m'),'\\Bi':mc('yellow','b'),'\\Be':mc('yellow',String.raw`\beta`),
  '\\Xs':mc('blue','x'),'\\Xv':mc('blue',String.raw`\mathbf{x}`),'\\Xm':mc('blue','X'),'\\Ph':mc('blue',String.raw`\phi`),
  '\\Yy':mc('green','y'),'\\Yv':mc('green',String.raw`\mathbf{y}`),'\\Yh':mc('green',String.raw`\hat{y}`),
  '\\Ff':mc('green','f'),'\\Fh':mc('green',String.raw`\hat{f}`),'\\Fb':mc('green',String.raw`\bar{f}`),
  '\\cL':mc('pink',String.raw`\mathcal{L}`),'\\cl':mc('pink',String.raw`\ell`),
  '\\Et':mc('orange',String.raw`\eta`),'\\Kk':mc('orange','k'),'\\Bw':mc('orange',String.raw`\sigma`),'\\Rl':mc('orange',String.raw`\lambda`),
  '\\Eps':mc('purple',String.raw`\varepsilon`),'\\Sg':mc('purple',String.raw`\sigma`),
  '\\Gr':mc('teal',String.raw`\nabla`),
  '\\Al':mc('yellow',String.raw`\alpha`),'\\Sl':mc('pink',String.raw`\xi`),'\\Ka':mc('blue',String.raw`\kappa`),'\\Gk':mc('orange',String.raw`\gamma`)
});}
