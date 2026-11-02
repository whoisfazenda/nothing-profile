import type { Palette, SchemeName } from "./types";

export function contrast(hex: string) {
  const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  return .2126*r+.7152*g+.0722*b>.179?"#111111":"#ffffff";
}
export function palette(seed: string, scheme: SchemeName, dark: boolean): Palette {
  const accent=/^#[0-9a-f]{6}$/i.test(seed)?seed:"#d71920";
  const bg=dark?"#000000":"#f2f2f2", surface=dark?"#1c1c1c":"#ffffff", raised=dark?"#292929":"#e7e7e7", ink=dark?"#f2f2f2":"#1c1c1c", muted=dark?"#aaaaaa":"#626262";
  const signal=scheme==="monochrome"?ink:accent, onSignal=contrast(signal), container=scheme==="vibrant"||scheme==="fidelity"?signal:raised;
  return {primary:signal,onPrimary:onSignal,primaryContainer:container,onPrimaryContainer:container===signal?onSignal:ink,
    secondary:ink,onSecondary:bg,secondaryContainer:raised,onSecondaryContainer:ink,tertiary:signal,onTertiary:onSignal,tertiaryContainer:raised,onTertiaryContainer:ink,
    error:"#d71920",onError:"#ffffff",errorContainer:raised,onErrorContainer:ink,surface:bg,surfaceDim:bg,surfaceBright:surface,
    surfaceContainerLowest:bg,surfaceContainerLow:surface,surfaceContainer:surface,surfaceContainerHigh:surface,surfaceContainerHighest:raised,
    onSurface:ink,onSurfaceVariant:muted,outline:muted,outlineVariant:dark?"#383838":"#d2d2d2",inverseSurface:ink,inverseOnSurface:bg,inversePrimary:signal,scrim:"#000000",shadow:"#000000"};
}
