# Guía de Estandarización de Colores

## Sistema de Tokens de Color

Tu aplicación ahora usa el sistema de tokens de Gluestack con dos colores de marca personalizados:

### Colores de Marca

#### `brand` - Color principal de la app (Teal/Verde)
- **Uso**: Acciones primarias, botones principales, elementos destacados
- **Valor base**: `#00a884` (brand-500)
- **Variantes**: `brand-50` a `brand-950`
- **Ejemplos**:
  - Botones primarios: `bg-brand-500 active:bg-brand-600`
  - Iconos destacados: `color="rgb(var(--color-brand-500))"`
  - Links importantes: `text-brand-500`

#### `accent` - Color secundario (Indigo)
- **Uso**: Elementos interactivos secundarios, badges, highlights
- **Valor base**: `#6366f1` (accent-500)
- **Variantes**: `accent-50` a `accent-950`
- **Ejemplos**:
  - Botones secundarios: `bg-accent-500`
  - Iconos secundarios: `color="rgb(var(--color-accent-500))"`
  - Badges: `bg-accent-100 text-accent-900`

### Colores Semánticos del Sistema

#### `typography` - Colores de texto
- **primary**: `text-typography-900` - Texto principal
- **secondary**: `text-typography-600` - Texto secundario
- **muted**: `text-typography-400` - Texto atenuado/placeholder
- **Uso de iconos**: `rgb(var(--color-typography-600))` para iconos secundarios

#### `background` - Colores de fondo
- **primary**: `bg-background-0` - Fondo principal
- **secondary**: `bg-background-50` - Fondo secundario/cards
- **elevated**: `bg-background-100` - Elementos elevados
- **muted**: `bg-background-muted` - Fondo atenuado

#### `outline` - Bordes y divisores
- **default**: `border-outline-300`
- **muted**: `border-outline-200`
- **strong**: `border-outline-500`

#### `error` - Estados de error
- **background**: `bg-error-50`
- **text**: `text-error-500`
- **border**: `border-error-500`
- **Ejemplo**: Mensajes de error, validaciones fallidas

#### `success` - Estados de éxito
- **background**: `bg-success-50`
- **text**: `text-success-500`
- **indicators**: `bg-success-500` (indicador online)
- **Ejemplo**: Confirmaciones, estados online

#### `warning` - Estados de advertencia
- **background**: `bg-warning-50`
- **text**: `text-warning-500`
- **Ejemplo**: Alertas, warnings

#### `info` - Estados informativos
- **background**: `bg-info-50`
- **text**: `text-info-500`
- **Ejemplo**: Mensajes informativos, tips

## Guía de Migración

### Reemplazo de Colores Hardcodeados

#### ❌ Antes (Colores Hardcodeados)
```tsx
// Hex colors inline
<View className="bg-[#00a884]">
  <Icon color="#6b7280" />
</View>

// Discord-style colors
<View className="dark:bg-[#313338]">
  <Text style={{ color: '#9ca3af' }}>Text</Text>
</View>

// Blue colors
<Button className="bg-blue-600 active:bg-blue-700">
```

#### ✅ Después (Tokens de Gluestack)
```tsx
// Usando tokens de marca
<View className="bg-brand-500">
  <Icon color="rgb(var(--color-typography-600))" />
</View>

// Usando tokens semánticos
<View className="bg-background-50">
  <Text className="text-typography-400">Text</Text>
</View>

// Usando brand color
<Button className="bg-brand-500 active:bg-brand-600">
```

### Patrones Comunes de Migración

#### 1. Botones Primarios
```tsx
// Antes
className="bg-blue-600 active:bg-blue-700"
className="bg-[#00a884]"

// Después
className="bg-brand-500 active:bg-brand-600"
```

#### 2. Iconos
```tsx
// Antes
<Icon size={20} color="#6b7280" />
<Icon size={20} color="#9ca3af" />

// Después
import { useIconColor } from '@/lib/theme-utils';
const iconColor = useIconColor('secondary'); // o 'muted'
<Icon size={20} color={iconColor} />

// O directamente
<Icon size={20} color="rgb(var(--color-typography-600))" />
```

#### 3. Usando el Componente ThemedIcon
```tsx
// Antes
<Home size={24} color="#6b7280" />
<MessageCircle size={24} color="#00a884" />

// Después
import { ThemedIcon } from '@/components/ui/themed-icon';
<ThemedIcon Icon={Home} size={24} variant="secondary" />
<ThemedIcon Icon={MessageCircle} size={24} variant="brand" />
```

#### 4. Backgrounds de Cards/Modals
```tsx
// Antes
className="bg-white dark:bg-[#313338]"
className="bg-gray-50 dark:bg-[#2b2d31]"

// Después
className="bg-background-0"
className="bg-background-50"
```

#### 5. Bordes
```tsx
// Antes
className="border-gray-200 dark:border-gray-700"
className="border-gray-300"

// Después
className="border-outline-300"
className="border-outline-200"
```

#### 6. ActivityIndicator
```tsx
// Antes
<ActivityIndicator color="#00a884" />
<ActivityIndicator color="#6366f1" />

// Después
<ActivityIndicator color="rgb(var(--color-brand-500))" />
<ActivityIndicator color="rgb(var(--color-accent-500))" />
```

#### 7. Switch/Toggle
```tsx
// Antes
trackColor={{ false: '#d1d5db', true: '#00a884' }}

// Después
trackColor={{ false: 'rgb(var(--color-outline-300))', true: 'rgb(var(--color-brand-500))' }}
```

### Tabla de Conversión Rápida

| Color Hardcodeado | Token de Gluestack | Uso |
|-------------------|-------------------|-----|
| `#00a884` | `brand-500` | Color principal de marca |
| `#6366f1` | `accent-500` | Color secundario/acentos |
| `#6b7280` | `typography-600` | Iconos/texto secundario |
| `#9ca3af` | `typography-400` | Iconos/texto atenuado |
| `#3b82f6` | `accent-500` | Cambiar a accent |
| `#ef4444` | `error-500` | Estados de error |
| `#10b981` | `success-500` | Estados de éxito |
| `#313338`, `#2b2d31` | `background-50` o `background-100` | Fondos oscuros Discord-style |
| `#36393f`, `#383a40` | `background-100` | Fondos elevados |
| `white`, `#ffffff` | `background-0` | Fondo principal |

## Utilities de Tema

### useIconColor Hook
```tsx
import { useIconColor } from '@/lib/theme-utils';

function MyComponent() {
  const primaryColor = useIconColor('primary');
  const brandColor = useIconColor('brand');
  const mutedColor = useIconColor('muted');
  
  return <Icon color={brandColor} />;
}
```

### useThemeColors Hook
```tsx
import { useThemeColors } from '@/lib/theme-utils';

function MyComponent() {
  const colors = useThemeColors();
  
  return (
    <>
      <Icon color={colors.brand} />
      <Text style={{ color: colors.secondary }}>Text</Text>
    </>
  );
}
```

### themeClasses Object
```tsx
import { themeClasses } from '@/lib/theme-utils';

function MyComponent() {
  return (
    <View className={themeClasses.background.primary}>
      <Text className={themeClasses.text.primary}>Title</Text>
      <Text className={themeClasses.text.secondary}>Subtitle</Text>
    </View>
  );
}
```

## Theme Switching

El sistema ahora soporta cambio de tema con persistencia:

```tsx
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { resolvedTheme, toggleTheme, themeMode } = useTheme();
  
  return (
    <Button onPress={toggleTheme}>
      Tema actual: {resolvedTheme}
    </Button>
  );
}
```

## Próximos Pasos

Los siguientes componentes aún necesitan migración:

1. ✅ **Autenticación** - `components/auth/*`
2. ✅ **Dashboard** - `components/dashboard/*`
3. 🔄 **Canales** - `components/channel/*` (en progreso)
4. ⏳ **Exploración** - `components/explore/*`
5. ⏳ **Configuración de Canales** - `components/channel-settings/*`
6. ⏳ **Nuevos Canales** - `components/newChannel/*`

## Reglas Importantes

1. **NUNCA** usar colores hex directamente en el código
2. **SIEMPRE** usar tokens de Gluestack (`brand`, `accent`, `typography`, etc.)
3. **PREFERIR** clases de Tailwind sobre inline styles
4. **USAR** componentes temáticos (`ThemedIcon`) cuando esté disponible
5. **MANTENER** consistencia: mismo color para mismo propósito en toda la app
