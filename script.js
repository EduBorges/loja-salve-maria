// --- DADOS DOS PRODUTOS ---
const produtosData = [
  {"SKU":"ACE0001","DESCRICAO":"Terço de Pescoço com Relicario","MATERIAL":"Metal","MODELO":"Colar","COR":"Dourado","TAMANHO":"30 cm","QTD":8,"PRECO":19,"IMAGES":["https://drive.google.com/thumbnail?id=1u2PuysuP2K6amDGqO2EUlc0uLtP-yr5-"],"CATEGORIA":"ACESSORIOS"},
  {"SKU":"ACE0002","DESCRICAO":"Anel Pai Nosso","MATERIAL":"Metal","MODELO":"Anel","COR":"Dourado","TAMANHO":"Diversos","QTD":8,"PRECO":10,"IMAGES":["https://drive.google.com/thumbnail?id=1siV9BrKhiPsXJUi1LiKlx4nxd3StK5sG"],"CATEGORIA":"ACESSORIOS"},
  {"SKU":"ACE0003","DESCRICAO":"Anel Pai Nosso","MATERIAL":"Metal","MODELO":"Anel","COR":"Prata","TAMANHO":"Diversos","QTD":12,"PRECO":10,"IMAGES":["https://drive.google.com/thumbnail?id=1siV9BrKhiPsXJUi1LiKlx4nxd3StK5sG"],"CATEGORIA":"ACESSORIOS"},
  {"SKU":"ACE0004","DESCRICAO":"Medalha NSª Graças","MATERIAL":"Metal","MODELO":"Pingente","COR":"Ouro Velho","TAMANHO":"02 cm","QTD":15,"PRECO":3,"IMAGES":["https://drive.google.com/thumbnail?id=1sLPZV3K38uFFe4yBfUR_lrG5coj9KLb_"],"CATEGORIA":"ACESSORIOS"},
  {"SKU":"ACE0005","DESCRICAO":"Medalha Cruz São Bento","MATERIAL":"Metal","MODELO":"Pingente","COR":"Ouro Velho","TAMANHO":"01 cm","QTD":15,"PRECO":3,"IMAGES":["https://drive.google.com/thumbnail?id=13BZlZbZApptWTjf5YfOvhyqVxufYD3MW"],"CATEGORIA":"ACESSORIOS"},
  {"SKU":"ART0001","DESCRICAO":"Vela Batismo - Torneada","MATERIAL":"Parafina","MODELO":"Vela","COR":"Branco","TAMANHO":"30 cm","QTD":10,"PRECO":6,"IMAGES":[],"CATEGORIA":"ARTESANATO"},
  {"SKU":"ART0002","DESCRICAO":"Vela Devocinal São Miguel","MATERIAL":"Parafina","MODELO":"Vela","COR":"Branco","TAMANHO":"08 cm","QTD":1,"PRECO":10,"IMAGES":[],"CATEGORIA":"ARTESANATO"},
  {"SKU":"ART0003","DESCRICAO":"Vela Devocinal Santa Terezinha","MATERIAL":"Parafina","MODELO":"Vela","COR":"Branco","TAMANHO":"08 cm","QTD":2,"PRECO":10,"IMAGES":[],"CATEGORIA":"ARTESANATO"},
  {"SKU":"ART0004","DESCRICAO":"Vela Branca Nº8","MATERIAL":"Parafina","MODELO":"Vela","COR":"Branco","TAMANHO":"08 cm","QTD":2,"PRECO":8,"IMAGES":[],"CATEGORIA":"ARTESANATO"},
  {"SKU":"ART0005","DESCRICAO":"Vela Branca Nº4","MATERIAL":"Parafina","MODELO":"Vela","COR":"Branco","TAMANHO":"04 cm","QTD":6,"PRECO":4,"IMAGES":[],"CATEGORIA":"ARTESANATO"},
  {"SKU":"ART0006","DESCRICAO":"Vela Devocinal São Miguel","MATERIAL":"Parafina","MODELO":"Vela","COR":"Colorida","TAMANHO":"08 cm","QTD":5,"PRECO":4,"IMAGES":[],"CATEGORIA":"ARTESANATO"},
  {"SKU":"ART0007","DESCRICAO":"Vela Devocinal NSª Graças","MATERIAL":"Parafina","MODELO":"Vela","COR":"Branco","TAMANHO":"13 cm","QTD":1,"PRECO":16,"IMAGES":[],"CATEGORIA":"ARTESANATO"},
  {"SKU":"ART0008","DESCRICAO":"Vela Devocinal São Miguel","MATERIAL":"Parafina","MODELO":"Vela","COR":"Branco","TAMANHO":"13 cm","QTD":1,"PRECO":16,"IMAGES":[],"CATEGORIA":"ARTESANATO"},
  {"SKU":"IMG0001","DESCRICAO":"Crucifixo Liso","MATERIAL":"Metal","MODELO":"Mesa","COR":"Dourada","TAMANHO":"20 cm","QTD":2,"PRECO":119,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0002","DESCRICAO":"Crucifixo","MATERIAL":"Metal","MODELO":"Mesa","COR":"Dourada","TAMANHO":"20 cm","QTD":3,"PRECO":119,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0003","DESCRICAO":"Crucifixo Liso","MATERIAL":"Metal","MODELO":"Parede","COR":"Prata","TAMANHO":"20 cm","QTD":1,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0004","DESCRICAO":"Crucifixo","MATERIAL":"Metal","MODELO":"Parede","COR":"Dourada","TAMANHO":"20 cm","QTD":1,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0005","DESCRICAO":"Crucifixo","MATERIAL":"MDF","MODELO":"Mesa|Parede","COR":"Claro","TAMANHO":"13 cm","QTD":1,"PRECO":35,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0006","DESCRICAO":"Crucifixo","MATERIAL":"MDF","MODELO":"Mesa|Parede","COR":"Claro","TAMANHO":"24 cm","QTD":1,"PRECO":65,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0007","DESCRICAO":"Crucifixo","MATERIAL":"MDF","MODELO":"Mesa|Parede","COR":"Escuro","TAMANHO":"24 cm","QTD":1,"PRECO":65,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0008","DESCRICAO":"Crucifixo","MATERIAL":"Resina","MODELO":"Parede","COR":"Colorido","TAMANHO":"10 cm","QTD":4,"PRECO":32,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0009","DESCRICAO":"Santa Rita Toten","MATERIAL":"Madeira|Metal","MODELO":"Mesa","COR":"Escuro","TAMANHO":"20 cm","QTD":1,"PRECO":70,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0010","DESCRICAO":"São Miguel Quadro","MATERIAL":"Metal","MODELO":"Mesa","COR":"Bronze","TAMANHO":"05 cm","QTD":2,"PRECO":19,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0011","DESCRICAO":"Medalha São Bento","MATERIAL":"Metal","MODELO":"Mesa","COR":"Chumbo","TAMANHO":"07 cm","QTD":1,"PRECO":19,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0012","DESCRICAO":"São Jorge","MATERIAL":"Madeira|Metal","MODELO":"Mesa","COR":"Prata","TAMANHO":"6cm","QTD":1,"PRECO":22,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0013","DESCRICAO":"Santa Edwiges","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":2,"PRECO":65,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0014","DESCRICAO":"São Roque","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":3,"PRECO":43,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0015","DESCRICAO":"Santa Ines","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":35,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0016","DESCRICAO":"Santa Efigenia","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":39,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0017","DESCRICAO":"Santa Veronica","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":34,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0018","DESCRICAO":"Anjo D'Guarda Menino","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":35,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0019","DESCRICAO":"Anjo D'Guarda Menina","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":35,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0020","DESCRICAO":"São Braz","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":39,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0021","DESCRICAO":"Santa Dulce","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":29,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0022","DESCRICAO":"São Jorge","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0023","DESCRICAO":"São Dimas","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":39,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0024","DESCRICAO":"Sao Luiz e Santa Zelia","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":130,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0025","DESCRICAO":"NSª Das Graças","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":2,"PRECO":45,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0026","DESCRICAO":"NSª Lourdes","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":2,"PRECO":45,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0027","DESCRICAO":"Jesus Misericordioso","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":45,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0028","DESCRICAO":"NSª Do Desterro","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":55,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0029","DESCRICAO":"Sagrada Familia (Sentada)","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":55,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0030","DESCRICAO":"Sagrada Familia (Importada)","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":2,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0031","DESCRICAO":"Divino Pai Eterno","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":45,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0032","DESCRICAO":"São Bento","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":2,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0033","DESCRICAO":"São Sebastião","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0034","DESCRICAO":"Santa Filomena","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0035","DESCRICAO":"Bom Jesus Pirapora","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":79,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0036","DESCRICAO":"NSª Desatadora dos Nós","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0037","DESCRICAO":"NSª Assunção","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0038","DESCRICAO":"Imaculado Coração de Maria","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0039","DESCRICAO":"NSª Lourdes","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":95,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0040","DESCRICAO":"NSª Perpetuo Socorro","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":79,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0041","DESCRICAO":"NSª Sorriso","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Branco","TAMANHO":"20 cm","QTD":1,"PRECO":120,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0042","DESCRICAO":"NSª Sorriso","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0043","DESCRICAO":"NSª Rainha da Paz","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":135,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0044","DESCRICAO":"NSª das Dores (Sentada)","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"20 cm","QTD":1,"PRECO":85,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0045","DESCRICAO":"São Camilo Lelis","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"10 cm","QTD":2,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0046","DESCRICAO":"NSª Desatadora dos Nós","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"10 cm","QTD":1,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0047","DESCRICAO":"Santa Marta","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"10 cm","QTD":1,"PRECO":15,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0048","DESCRICAO":"NSª Saude","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"10 cm","QTD":1,"PRECO":10,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0049","DESCRICAO":"Sao Miguel (Baby)","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"10 cm","QTD":1,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0050","DESCRICAO":"NSª Aparecida","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"12 cm","QTD":2,"PRECO":59,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0051","DESCRICAO":"NSª Guadalupe","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"18 cm","QTD":3,"PRECO":92,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0052","DESCRICAO":"Carlo Acutis","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"18 cm","QTD":2,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0053","DESCRICAO":"São José - Dormindo","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"12 cm","QTD":4,"PRECO":89,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0054","DESCRICAO":"Triade Arcanjos","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":140,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0055","DESCRICAO":"Sagrada Familia - Barroco","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":2,"PRECO":135,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0056","DESCRICAO":"São Bento","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":78,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0057","DESCRICAO":"Santa Rita","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":85,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0058","DESCRICAO":"NSª Aparecida","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":2,"PRECO":78,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0059","DESCRICAO":"Menino Jesus - Praga","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"13 cm","QTD":1,"PRECO":78,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0060","DESCRICAO":"Menino Jesus - Almofada","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"10 cm","QTD":1,"PRECO":65,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0061","DESCRICAO":"NSª Auxiliadora","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"10 cm","QTD":1,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0062","DESCRICAO":"NSª Guadalupe","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":6,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0063","DESCRICAO":"Virgem Guadalupe","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":2,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0064","DESCRICAO":"São Judas Tadeu","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":2,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0065","DESCRICAO":"NSª Das Graças - Baby","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":2,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0066","DESCRICAO":"Santa Dulce","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":1,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0067","DESCRICAO":"Aparecida","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":2,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0068","DESCRICAO":"Virgem Aparecida","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":2,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0069","DESCRICAO":"São Lazaro","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":1,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0070","DESCRICAO":"Santa Terezinha","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":3,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0071","DESCRICAO":"São Rafael","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":3,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0072","DESCRICAO":"São Gabriel","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":3,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0073","DESCRICAO":"São José","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":3,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0074","DESCRICAO":"São Francisco","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":1,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0075","DESCRICAO":"NSª Fatima","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":1,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0076","DESCRICAO":"Sagrada Familia","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":5,"PRECO":29,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0077","DESCRICAO":"NSª Carmo","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":1,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0078","DESCRICAO":"São Dimas","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":1,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0079","DESCRICAO":"Anjinho Branco","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"8 cm","QTD":2,"PRECO":25,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0080","DESCRICAO":"Divino Espirito Santo - Pomba","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"9 cm","QTD":1,"PRECO":42,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0081","DESCRICAO":"NSª Fatima","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"12 cm","QTD":1,"PRECO":43,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0082","DESCRICAO":"São Miguel - Escudo Chumbo","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"10 cm","QTD":3,"PRECO":45,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0083","DESCRICAO":"São Miguel - Escudo Prata","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"9 cm","QTD":1,"PRECO":45,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0084","DESCRICAO":"São Miguel","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"30 cm","QTD":1,"PRECO":320,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0085","DESCRICAO":"NSª Graças - Barroco","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"30 cm","QTD":1,"PRECO":320,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0086","DESCRICAO":"NSª Aparecida","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"30 cm","QTD":1,"PRECO":220,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0087","DESCRICAO":"NSª Fatima","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"30 cm","QTD":1,"PRECO":230,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0088","DESCRICAO":"Divino Espirito Santo - Esplendor","MATERIAL":"Resina","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"15 cm","QTD":1,"PRECO":65,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0089","DESCRICAO":"Sagrada Familia - Luminaria","MATERIAL":"Plastico","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"11 cm","QTD":1,"PRECO":20,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0090","DESCRICAO":"Sagrado Coração - Luminaria","MATERIAL":"Plastico","MODELO":"Estatueta","COR":"Colorido","TAMANHO":"11 cm","QTD":1,"PRECO":20,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0091","DESCRICAO":"NSª Aparecida - Carro","MATERIAL":"Metal","MODELO":"Estatueta","COR":"Prata","TAMANHO":"05 cm","QTD":3,"PRECO":18,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"IMG0092","DESCRICAO":"NSª Aparecida - Carro","MATERIAL":"Metal","MODELO":"Estatueta","COR":"Dourada","TAMANHO":"05 cm","QTD":2,"PRECO":18,"IMAGES":[],"CATEGORIA":"IMAGENS"},
  {"SKU":"LIV0001","DESCRICAO":"Orações Selecionadas","MATERIAL":"Papel","MODELO":"Livreto","COR":"Vermelho","TAMANHO":"16 cm","QTD":1,"PRECO":36,"IMAGES":["https://drive.google.com/thumbnail?id=1NLMhexcSVOWYHdtFn4RC_iRa7qZEstgI"],"CATEGORIA":"LIVROS"},
  {"SKU":"LIV0002","DESCRICAO":"Biblia Ave Maria - Catequese","MATERIAL":"Papel","MODELO":"Livro","COR":"Branco","TAMANHO":"18 cm","QTD":1,"PRECO":52,"IMAGES":["https://drive.google.com/thumbnail?id=1XrvamD7REqzLM57bNmcAacALUMX9S8BW"],"CATEGORIA":"LIVROS"},
  {"SKU":"LIV0003","DESCRICAO":"Oficio da Imaculada Conceição","MATERIAL":"Papel","MODELO":"Livreto","COR":"Colorido","TAMANHO":"16 cm","QTD":2,"PRECO":14,"IMAGES":["https://drive.google.com/thumbnail?id=1JSb6K_mup7_jcc6wuEw2ILyngTqKpx9F"],"CATEGORIA":"LIVROS"},
  {"SKU":"LIV0004","DESCRICAO":"Manual do Cristão","MATERIAL":"Papel","MODELO":"Livreto","COR":"Branco","TAMANHO":"13 cm","QTD":7,"PRECO":9,"IMAGES":["https://drive.google.com/thumbnail?id=1IwhrHUABVWzdTbIfrwCk4a8mq7V3amvx"],"CATEGORIA":"LIVROS"},
  {"SKU":"LIV0005","DESCRICAO":"Minha vocação e o Amor - Santa Terezinha","MATERIAL":"Papel","MODELO":"Livreto","COR":"Branco","TAMANHO":"15 cm","QTD":1,"PRECO":9,"IMAGES":["https://drive.google.com/thumbnail?id=1030N_v1Yx5tGrrKjWVLArIgm0QWQYO5O"],"CATEGORIA":"LIVROS"},
  {"SKU":"ACE0001","DESCRICAO":"TERÇO","MATERIAL":"MADEIRA","MODELO":"SANTOS","COR":"IMBUIA","TAMANHO":"30 CM","QTD":5,"PRECO":10,"IMAGES":[],"CATEGORIA":"TERÇOS"},
  {"SKU":"QUE0001","DESCRICAO":"CAMISETAS","MATERIAL":"ALGODÃO","MODELO":"DIVERSOS","COR":"DIVEROSOS","TAMANHO":"DIVERSOS","QTD":10,"PRECO":40,"IMAGES":[],"CATEGORIA":"QUEIMA ESTOQUE"}
];
 
// --- CONFIGURAÇÕES ---
const TELEFONE_LOJA = "5515997769053";
const QUANTIDADE_MAXIMA_POR_ITEM = 3;

// --- ESTADO DA APLICAÇÃO ---
let produtos = [];
let carrinho = [];
let termoPesquisa = '';
let categoriaAtiva = 'todos';
let carrinhoAberto = false;

// --- ELEMENTOS DOM ---
const produtosContainer = document.getElementById('produtos-container');
const carrinhoIcon = document.getElementById('carrinho-icon');
const carrinhoSidebar = document.getElementById('carrinho-sidebar');
const carrinhoContent = document.getElementById('carrinho-content');
const carrinhoTotal = document.getElementById('carrinho-total');
const carrinhoCount = document.getElementById('carrinho-count');
const categoriasContainer = document.getElementById('categorias-container');
const feedback = document.getElementById('feedback');
const modalOverlay = document.getElementById('modal-overlay');
const formDadosCliente = document.getElementById('dados-cliente');
const btnCancelar = document.getElementById('cancelar-pedido');
const pesquisaInput = document.getElementById('pesquisa-input');
const limparPesquisaBtn = document.getElementById('limpar-pesquisa');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
const limparCarrinhoBtn = document.getElementById('limpar-carrinho');

// Elementos do Modal de Zoom
const zoomModal = document.getElementById('zoom-modal');
const zoomImg = document.getElementById('img-zoom-destaque');
const zoomClose = document.querySelector('.zoom-close');

// --- GERENCIAMENTO DE HISTÓRICO (NAVEGAÇÃO MOBILE) ---

// Função auxiliar para atualizar histórico se não estiver na "home"
function atualizarHistorico(estado) {
    // Se estamos na home e vamos para algo interno, adicionamos um estado
    if (!history.state || history.state.page === 'home') {
        history.pushState({ page: 'inner' }, '');
    } 
    // Se já estamos em algo interno, apenas substituímos para não criar pilha infinita
    else {
        history.replaceState({ page: 'inner' }, '');
    }
}

// Inicializa o histórico como 'home'
if (!history.state) {
    history.replaceState({ page: 'home' }, '');
}

// Evento POPSTATE (Quando clica no botão voltar)
window.addEventListener('popstate', (event) => {
    // Se o usuário clicou em voltar, precisamos fechar tudo e resetar para a home
    
    // Fecha Carrinho
    if (carrinhoAberto) {
        toggleCarrinho(false); // false indica para não mexer no histórico novamente
    }
    
    // Fecha Zoom
    if (zoomModal.style.display === "block") {
        zoomModal.style.display = "none";
    }
    
    // Fecha Modal de Pedido
    if (modalOverlay.style.display === "flex") {
        modalOverlay.style.display = "none";
        document.body.style.overflow = '';
    }
    
    // Reseta Categoria e Pesquisa se estiverem ativos
    if (categoriaAtiva !== 'todos' || termoPesquisa !== '') {
        document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
        const todosBtn = document.querySelector('.categoria-btn[data-categoria="todos"]');
        if(todosBtn) todosBtn.classList.add('active');
        
        categoriaAtiva = 'todos';
        termoPesquisa = '';
        pesquisaInput.value = '';
        limparPesquisaBtn.style.display = 'none';
        renderizarProdutos();
    }
});


// --- FUNÇÕES PRINCIPAIS ---

function carregarProdutos() {
    produtos = produtosData;
    gerarBotoesCategoria();
    renderizarProdutos();
    atualizarCarrinho();
    console.log("Loja carregada com sucesso!");
}

function gerarBotoesCategoria() {
    const todosBtn = document.querySelector('.categoria-btn[data-categoria="todos"]');
    categoriasContainer.innerHTML = '';
    categoriasContainer.appendChild(todosBtn);
    
    const categorias = [...new Set(produtos.map(p => p.CATEGORIA))];
    
    const iconesCategorias = {
        'ACESSORIOS': 'fas fa-gem',
        'ARTESANATO': 'fas fa-paint-brush',
        'IMAGENS': 'fas fa-cross',
        'LIVROS': 'fas fa-book',
        'TERÇOS': 'fas fa-pray',
        'QUEIMA ESTOQUE': 'fas fa-fire'
    };
    
    categorias.forEach(categoria => {
        if (!categoria) return;
        
        const btn = document.createElement('button');
        btn.className = 'categoria-btn';
        btn.setAttribute('data-categoria', categoria);
        
        const iconeClasse = iconesCategorias[categoria] || 'fas fa-box';
        
        btn.innerHTML = `
            <i class="${iconeClasse}"></i> 
            ${categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase()}
        `;
        
        btn.addEventListener('click', () => {
            // Atualiza histórico ao navegar
            atualizarHistorico('categoria');

            document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            categoriaAtiva = categoria;
            pesquisaInput.value = '';
            termoPesquisa = '';
            limparPesquisaBtn.style.display = 'none';
            renderizarProdutos();
        });
        
        categoriasContainer.appendChild(btn);
    });

    todosBtn.addEventListener('click', () => {
        // Voltar para "todos" é tecnicamente voltar para home, mas se o usuário clicar, resetamos
        if (history.state && history.state.page === 'inner') {
             history.back(); // Simula o botão voltar
             return;
        }
        document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
        todosBtn.classList.add('active');
        categoriaAtiva = 'todos';
        renderizarProdutos();
    });
}

function pesquisarProdutos() {
    termoPesquisa = pesquisaInput.value.trim().toLowerCase();
    limparPesquisaBtn.style.display = termoPesquisa ? 'flex' : 'none';
    
    // Se começou a pesquisar, marca no histórico
    if (termoPesquisa.length > 0) {
        atualizarHistorico('pesquisa');
    }
    
    renderizarProdutos();
}

function renderizarProdutos() {
    produtosContainer.innerHTML = '';
    
    let produtosFiltrados = produtos;
    
    if (termoPesquisa) {
        produtosFiltrados = produtos.filter(p => 
            (p.DESCRICAO && p.DESCRICAO.toLowerCase().includes(termoPesquisa)) ||
            (p.CATEGORIA && p.CATEGORIA.toLowerCase().includes(termoPesquisa))
        );
    } 
    else if (categoriaAtiva !== 'todos') {
        produtosFiltrados = produtos.filter(p => p.CATEGORIA === categoriaAtiva);
    }
    
    if (produtosFiltrados.length === 0) {
        produtosContainer.innerHTML = `<p style="text-align: center; grid-column: 1 / -1; padding: 20px;">Nenhum produto encontrado.</p>`;
        return;
    }

    produtosFiltrados.forEach(produto => {
        const produtoCard = document.createElement('div');
        produtoCard.className = 'produto-card';
        
        let imagemSrc = '';
        if (produto.IMAGES && produto.IMAGES.length > 0) {
            imagemSrc = produto.IMAGES[0];
        } else {
            imagemSrc = 'https://placehold.co/200x200/e0e0e0/999999?text=Sem+Imagem'; 
        }
        
        const tamanhoDisplay = (produto.TAMANHO && isNaN(produto.TAMANHO)) ? produto.TAMANHO : `${produto.TAMANHO} cm`;

        produtoCard.innerHTML = `
            <div class="produto-imagem-container">
                <img src="${imagemSrc}" alt="${produto.DESCRICAO}" class="produto-imagem" loading="lazy">
            </div>
            <div class="produto-info">
                <div class="produto-titulo">${produto.DESCRICAO}</div>
                <div class="produto-atributos">
                    <p><strong>Material:</strong> ${produto.MATERIAL}</p>
                    <p><strong>Tamanho:</strong> ${tamanhoDisplay}</p>
                </div>
                <div class="produto-preco">R$ ${parseFloat(produto.PRECO).toFixed(2).replace('.', ',')}</div>
                <button class="btn add-carrinho" data-sku="${produto.SKU}">Comprar</button>
            </div>
        `;
        
        produtosContainer.appendChild(produtoCard);
    });
}

// --- CARRINHO ---

function adicionarAoCarrinho(sku) {
    const produto = produtos.find(p => p.SKU === sku);
    if (!produto) return;

    const itemExistente = carrinho.find(item => item.SKU === sku);
    
    if (itemExistente) {
        if (itemExistente.quantidade >= QUANTIDADE_MAXIMA_POR_ITEM) {
            mostrarFeedback(`Limite máximo atingido (${QUANTIDADE_MAXIMA_POR_ITEM} un.)`, 'error');
            return;
        }
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    atualizarCarrinho();
    mostrarFeedback('Adicionado ao carrinho!');
    
    if (!carrinhoAberto) {
        toggleCarrinho(true); // true indica que foi ação do usuário (abrir)
    }
}

function removerDoCarrinho(sku) {
    carrinho = carrinho.filter(item => item.SKU !== sku);
    atualizarCarrinho();
}

function limparCarrinho() {
    if (carrinho.length === 0) {
        mostrarFeedback('O carrinho já está vazio!', 'error');
        return;
    }
    if (confirm('Deseja esvaziar o carrinho?')) {
        carrinho = [];
        atualizarCarrinho();
        mostrarFeedback('Carrinho limpo.');
    }
}

function atualizarQuantidade(sku, novaQuantidade) {
    const item = carrinho.find(item => item.SKU === sku);
    if (item) {
        if (novaQuantidade > QUANTIDADE_MAXIMA_POR_ITEM) {
            mostrarFeedback(`Máximo de ${QUANTIDADE_MAXIMA_POR_ITEM} unidades.`, 'error');
            novaQuantidade = QUANTIDADE_MAXIMA_POR_ITEM;
        } else if (novaQuantidade < 1) {
            novaQuantidade = 1;
        }
        item.quantidade = novaQuantidade;
        atualizarCarrinho();
    }
}

function atualizarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    carrinhoCount.textContent = totalItens;
    carrinhoCount.style.display = totalItens > 0 ? 'flex' : 'none';

    carrinhoContent.innerHTML = '';

    if (carrinho.length === 0) {
        carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
        carrinhoTotal.textContent = '0,00';
        return;
    }

    let total = 0;
    carrinho.forEach(item => {
        total += item.PRECO * item.quantidade;
        const imgUrl = (item.IMAGES && item.IMAGES.length > 0) ? item.IMAGES[0] : 'https://placehold.co/100x100/e0e0e0/999999?text=...';
        const carrinhoItem = document.createElement('div');
        carrinhoItem.className = 'carrinho-item';
        carrinhoItem.innerHTML = `
            <div class="carrinho-item-img-container">
                <img class="carrinho-item-img" src="${imgUrl}" alt="${item.DESCRICAO}">
            </div>
            <div class="carrinho-item-detalhes">
                <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                <div class="carrinho-item-preco">R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}</div>
                <div class="carrinho-item-controles" data-sku="${item.SKU}">
                    <button class="quantidade-btn" data-action="decrementar">-</button>
                    <input type="number" class="quantidade-input" value="${item.quantidade}" min="1" max="${QUANTIDADE_MAXIMA_POR_ITEM}" readonly>
                    <button class="quantidade-btn" data-action="incrementar">+</button>
                    <span class="remover-item">Excluir</span>
                </div>
            </div>
        `;
        carrinhoContent.appendChild(carrinhoItem);
    });
    
    carrinhoTotal.textContent = total.toFixed(2).replace('.', ',');
}

function toggleCarrinho(fromUserAction = true) {
    // Se fromUserAction for true, significa que o usuário clicou para abrir/fechar
    // Se for false, foi o botão voltar do navegador (não mexemos no histórico)
    
    carrinhoAberto = !carrinhoAberto;
    
    if(carrinhoAberto) {
        carrinhoSidebar.classList.add('open');
        if (fromUserAction) atualizarHistorico('carrinho');
    } else {
        carrinhoSidebar.classList.remove('open');
        // Se fechou clicando no ícone ou fora, e o histórico diz que está "inner", voltamos o histórico
        if (fromUserAction && history.state && history.state.page === 'inner') {
            history.back();
        }
    }
}

// --- CHECKOUT WHATSAPP ---

function finalizarPedidoWhatsApp() {
    if (carrinho.length === 0) {
        mostrarFeedback('Carrinho vazio.', 'error');
        return;
    }
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    atualizarHistorico('checkout');
}

formDadosCliente.addEventListener('submit', function(e) {
    e.preventDefault();
    const nomeCliente = document.getElementById('nome-cliente').value.trim();
    const telefoneCliente = document.getElementById('telefone-cliente').value.replace(/\D/g, '');
    const observacoes = document.getElementById('observacoes').value.trim();
    
    if (!nomeCliente || !telefoneCliente) {
        mostrarFeedback('Preencha os campos.', 'error');
        return;
    }
    
    // === FORMATAÇÃO WHATSAPP ===
    let mensagem = `===========================\n`;
    mensagem += `Loja Salve Maria\n`;
    mensagem += `===========================\n`;
    mensagem += `Cliente: ${nomeCliente}\n`;
    mensagem += `WhatsApp: ${telefoneCliente}\n`;
    mensagem += `===========================\n`;
    mensagem += `Itens do Pedido:\n\n`;
    
    carrinho.forEach((item) => {
        const valorUnitario = parseFloat(item.PRECO).toFixed(2).replace('.', ',');
        const subtotal = (item.PRECO * item.quantidade).toFixed(2).replace('.', ',');
        
        mensagem += `${item.DESCRICAO}\n`;
        mensagem += `   - Valor unitário: R$ ${valorUnitario}\n`;
        mensagem += `   - Quantidade: ${item.quantidade}\n`;
        mensagem += `   - Subtotal: R$ ${subtotal}\n`;
        mensagem += `   - REF: ${item.SKU}\n\n`;
    });
    
    const total = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
    const totalFormatado = total.toFixed(2).replace('.', ',');
    
    mensagem += `===========================\n`;
    mensagem += `TOTAL: R$ ${totalFormatado}\n`;
    mensagem += `===========================\n`;
    mensagem += `OBS: ${observacoes}\n\n\n`;
    
    mensagem += `===========================\n`;
    mensagem += `“Aguardo a confirmação de \nestoque e prazo de entrega.”`;
    
    const linkZap = `https://wa.me/${TELEFONE_LOJA}?text=${encodeURIComponent(mensagem)}`;
    window.open(linkZap, '_blank');
    
    // Fecha modal
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    
    // Volta histórico se necessário
    if (history.state && history.state.page === 'inner') history.back();

    carrinho = [];
    atualizarCarrinho();
    formDadosCliente.reset();
    mostrarFeedback('Pedido enviado! Verifique seu WhatsApp.');
});

// --- EVENT LISTENERS GERAIS ---

pesquisaInput.addEventListener('input', pesquisarProdutos);
limparPesquisaBtn.addEventListener('click', () => {
    pesquisaInput.value = '';
    pesquisarProdutos();
});

carrinhoIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCarrinho(true);
});

finalizarPedidoBtn.addEventListener('click', finalizarPedidoWhatsApp);
limparCarrinhoBtn.addEventListener('click', limparCarrinho);

carrinhoContent.addEventListener('click', (e) => {
    e.stopPropagation();

    const target = e.target;
    const itemControles = target.closest('.carrinho-item-controles');
    if (!itemControles) return;

    const sku = itemControles.dataset.sku;
    const item = carrinho.find(i => i.SKU === sku);
    if (!item) return;

    if (target.classList.contains('quantidade-btn')) {
        const action = target.dataset.action;
        const novaQtd = action === 'incrementar' ? item.quantidade + 1 : item.quantidade - 1;
        atualizarQuantidade(sku, novaQtd);
    } else if (target.classList.contains('remover-item')) {
        removerDoCarrinho(sku);
    }
});

// Listener modificado para capturar cliques na imagem e no botão comprar
produtosContainer.addEventListener('click', (e) => {
    // Comprar
    if (e.target.classList.contains('add-carrinho')) {
        const sku = e.target.dataset.sku;
        adicionarAoCarrinho(sku);
    }
    // Zoom
    if (e.target.classList.contains('produto-imagem')) {
        const src = e.target.src;
        zoomModal.style.display = "block";
        zoomImg.src = src;
        atualizarHistorico('zoom');
    }
});

// Fechar Zoom
zoomClose.addEventListener('click', () => {
    zoomModal.style.display = "none";
    if (history.state && history.state.page === 'inner') history.back();
});
zoomModal.addEventListener('click', (e) => {
    if (e.target === zoomModal) {
        zoomModal.style.display = "none";
        if (history.state && history.state.page === 'inner') history.back();
    }
});

btnCancelar.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    if (history.state && history.state.page === 'inner') history.back();
});
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
        if (history.state && history.state.page === 'inner') history.back();
    }
});

document.getElementById('telefone-cliente').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    if (v.length > 9) v = `${v.slice(0,10)}-${v.slice(10)}`;
    e.target.value = v;
});

function mostrarFeedback(texto, tipo = 'success') {
    feedback.textContent = texto;
    feedback.className = 'feedback';
    feedback.classList.add(tipo === 'error' ? 'error' : 'show');
    feedback.classList.add('show');
    setTimeout(() => feedback.classList.remove('show'), 3000);
}

document.addEventListener('click', (e) => {
    const target = e.target;
    if (carrinhoAberto && !carrinhoSidebar.contains(target) && !carrinhoIcon.contains(target)) {
        toggleCarrinho(true);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    try {
        const stored = localStorage.getItem('carrinho');
        if (stored) carrinho = JSON.parse(stored);
    } catch (e) {
        console.error("Erro storage", e);
        localStorage.removeItem('carrinho');
    }
    carregarProdutos();
});
