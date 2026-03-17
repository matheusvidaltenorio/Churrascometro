# Documentação do Cálculo - Churrascômetro

Este documento explica **passo a passo** como cada quantidade é calculada. Útil para entender, debugar ou ajustar as regras.

## Fórmulas

### 1. Pessoas Efetivas

```
Pessoas efetivas = Homens + Mulheres + (Crianças × 0.5)
```

**Por quê?** Crianças geralmente comem e bebem menos que adultos. Consideramos cada criança como metade de um adulto.

**Exemplo:** 4 homens + 3 mulheres + 2 crianças = 4 + 3 + 1 = **8 pessoas efetivas**

---

### 2. Carne (kg)

```
Carne por pessoa (gramas):
  - Leve:    400g
  - Moderado: 500g
  - Pesado:  700g

Carne total (g) = Pessoas efetivas × Gramas por pessoa
Carne total (kg) = Carne total (g) / 1000
```

**Por quê?** O perfil "leve" representa convidados que comem pouco (mais conversa). "Pesado" são aqueles que repetem várias vezes.

**Exemplo:** 10 pessoas, moderado = 10 × 500 = 5000g = **5 kg**

---

### 3. Cerveja (litros)

```
Cerveja = Adultos × 1.75 L
```

**Por quê?** Média entre 1.5L e 2L por adulto. Crianças não entram no cálculo de cerveja.

**Exemplo:** 8 adultos = 8 × 1.75 = **14 L**

---

### 4. Refrigerante/Água (litros)

```
Refrigerante = (Pessoas efetivas × 500 ml) / 1000
```

**Por quê?** 500ml por pessoa é um baseline conservador. Ajuste conforme preferência (mais água em dias quentes).

**Exemplo:** 10 pessoas = 10 × 0.5 = **5 L**

---

### 5. Carvão (kg)

```
Carvão = Pessoas efetivas / 4
```

**Por quê?** 1 kg de carvão atende ~4 pessoas em um churrasco médio. Depende do tipo de churrasqueira.

**Exemplo:** 12 pessoas = 12/4 = **3 kg**

---

### 6. Gelo (kg)

```
Gelo = Pessoas efetivas / 5
```

**Por quê?** 1 kg de gelo para cada 5 pessoas mantém bebidas geladas por algumas horas.

**Exemplo:** 15 pessoas = 15/5 = **3 kg**

---

## Ajustes Condicionais

### Duração > 6 horas → +20%

Se o churrasco durar mais de 6 horas, **todos** os itens recebem um multiplicador de 1.2 (20% a mais).

**Motivo:** Churrascos longos = mais tempo comendo e bebendo.

```
Todos os valores × 1.2
```

---

### Público "Pesado" → +30% em bebidas

Se o tipo de público for "pesado", **cerveja e refrigerante** recebem +30%.

**Motivo:** Pessoas que comem muito tendem a beber mais também.

```
Cerveja × 1.3
Refrigerante × 1.3
```

---

## Breakdown de Carnes

Proporção fixa para variedade:

| Tipo    | %   | Exemplo (5 kg total) |
|---------|-----|----------------------|
| Bovina  | 40% | 2.0 kg               |
| Frango  | 30% | 1.5 kg               |
| Linguiça| 30% | 1.5 kg               |

**Cálculo:**
```
Bovina   = Total carne × 0.4
Frango   = Total carne × 0.3
Linguiça = Total carne × 0.3
```

---

## Arredondamento

- **Carne, carvão, gelo:** 1 casa decimal, arredondado para cima
- **Bebidas:** 1 casa decimal, arredondado para cima
- **Motivo:** Melhor sobrar do que faltar!

---

## Onde está no código?

- **Backend:** `backend/src/modules/barbecue/barbecue.service.ts`
- Constantes no topo do arquivo podem ser ajustadas sem alterar a lógica.
