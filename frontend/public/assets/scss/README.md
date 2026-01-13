# CloudPlay Design System - Editorial Warmth

## 🎨 Direction Esthétique

Un design system moderne avec une approche "Editorial Warmth" :
- **Palette** : Tons terreux (terracotta, crème, charcoal) avec des accents vifs
- **Typographie** : Fraunces (display) + Plus Jakarta Sans (body)
- **Style** : Bordures épaisses, ombres douces, layouts asymétriques
- **Animations** : Micro-interactions fluides et intentionnelles

## 📁 Structure

```
public/assets/scss/
├── _variables.scss    # Variables globales (couleurs, spacing, typography, etc.)
└── global.scss        # Styles globaux, reset CSS, utilities
```

## 🎯 Variables Disponibles

### Couleurs
- **Primary** : `$color-terracotta`, `$color-cream`, `$color-charcoal`
- **Accents** : `$color-sage`, `$color-coral`, `$color-amber`, `$color-slate`
- **Semantic** : `$color-success`, `$color-error`, `$color-warning`, `$color-info`

### Typographie
- **Fonts** : `$font-display`, `$font-body`, `$font-mono`
- **Sizes** : `$font-size-xs` → `$font-size-6xl`
- **Weights** : `$font-weight-light` → `$font-weight-extrabold`

### Spacing
- De `$spacing-1` (4px) à `$spacing-24` (96px)

### Borders & Radius
- **Width** : `$border-width-thin` → `$border-width-heavy`
- **Radius** : `$border-radius-sm` → `$border-radius-2xl`, `$border-radius-full`

### Shadows
- Standards : `$shadow-sm` → `$shadow-2xl`
- Editorial : `$shadow-editorial-sm/md/lg` (avec teinte terracotta)

### Transitions
- **Duration** : `$transition-fast` (150ms) → `$transition-slower` (500ms)
- **Easing** : `$ease-in-out`, `$ease-out`, `$ease-in`, `$ease-bounce`

## 📐 Mixins Utiles

```scss
@include respond-to($breakpoint-md) { ... }  // Media queries
@include truncate;                            // Text ellipsis
@include focus-ring;                          // Focus outline
@include hover-lift;                          // Hover animation
```

## 🎨 Usage dans les Composants

```scss
@import '../../../../public/assets/scss/variables';

.my-component {
  padding: $spacing-4;
  background: $color-cream;
  border: $border-width-medium solid $color-terracotta;
  border-radius: $border-radius-lg;
  transition: all $transition-base $ease-out;

  &:hover {
    @include hover-lift;
  }
}
```

## 🚀 Next Steps

1. **Compiler SCSS** : Configurer Vite/Webpack pour compiler les fichiers SCSS
2. **Components TypeScript** : Créer les composants React avec TypeScript
3. **Storybook** (optionnel) : Documenter visuellement tous les composants
