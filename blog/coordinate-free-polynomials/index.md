---
layout: 'blog'
title: 'Coordinate-free definitions of polynomials'
date: '18 Nov 2024'
mathjax: true
center_equations: true
---

<div style="display:none">
  $$
  \newcommand{\R}{\mathbb{R}}
  \newcommand{\C}{\mathbb{C}}
  $$
</div>

There are two common notions of a polynomial over a field $$K$$.

1. A _polynomial function_ in $$n$$ variables is a function $$f : K^n \to K$$ of the form

    $$
    \sum_{d_1, \ldots, d_n = 0}^\infty a_{d_1, \ldots, d_n} x_1^{d_1}\cdots x_n^{d_n}
    $$

    where $$x_i : K^n \to K$$ is the function which extracts the $$i$$th coordinate, and all but finitely many of the coefficients $$a_{d_1, \ldots, d_n} \in K$$ are zero.

2. A _formal polynomial_ in $$n$$ variables is an element of the vector space generated by countably infinitely many basis elements denoted

    $$
    x_1^{d_1}\cdots x_n^{d_n}
    $$

    where $$d_1, \ldots, d_n$$ is an sequence of $$n$$ natural numbers. (Unlike before, $$x_1^{d_1}\cdots x_n^{d_n}$$ is _not_ a product of functions; it is simply notation.) We define multiplication of formal polynomials by defining it on the basis elements as

    $$ 
    \big(x_1^{d_1}\cdots x_n^{d_n}\big) \cdot \big(x_1^{e_1}\cdots x_n^{e_n}\big) := x_1^{d_1 + e_1}\cdots x_n^{d_n + e_n}
    $$

    and extending to all polynomials linearly.

This distinction may seem to be irrelevant at first glance. Indeed, there is a surjective algebra homomorphism from formal polynomials to polynomial functions defined by interpreting $$x_1^{d_1}\cdots x_n^{d_n}$$ as an actual product of coordinate functions, and over infinite fields such as $$\R$$ and $$\C$$, this map is in fact an isomorphism. However, it fails to be injective over finite fields, for the simple reason that there are infinitely many formal polynomials, but only finitely many functions from $$K^n$$ to $$K$$. An explicit example is given by Fermat's little theorem: over the finite field $$F_p$$, $$x^p$$ and $$x$$ are distinct formal polynomials, but the same polynomial function.

EXPLAIN 

### Polynomials on a vector space

### Formal polynomials on a vector space

### Polynomials on an affine space

### Formal polynomials on a vector space