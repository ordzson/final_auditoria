export const interviewAudio: Record<string, string> = {
  "SALUDO-INICIAL": "frase_01.mp3",
  "SALUDO-REGRESO": "frase_02.mp3",
  "TE-ESCUCHO": "frase_03.mp3",
  "AU-01": "frase_04.mp3",
  "P-IDENTIDAD": "frase_05.mp3",
  "R-IDENTIDAD": "frase_06.mp3",
  "P-POLITICA": "frase_07.mp3",
  "R-POLITICA": "frase_08.mp3",
  "AU-02": "frase_09.mp3",
  "P-FUJO": "frase_10.mp3",
  "R-VOLUMEN": "frase_11.mp3",
  "R-FLUJO": "frase_12.mp3",
  "AU-03": "frase_13.mp3",
  "P-INTEGRIDAD": "frase_14.mp3",
  "R-CONCILIACION": "frase_15.mp3",
  "P-APROBACION": "frase_16.mp3",
  "R-TICKET": "frase_17.mp3",
  "R-VERBAL": "frase_18.mp3",
  "AU-04": "frase_19.mp3",
  "P-ALERTA": "frase_20.mp3",
  "R-RESPUESTA": "frase_21.mp3",
  "AU-05": "frase_22.mp3",
  "P-RESTAURACION": "frase_23.mp3",
  "R-RECUPERACION": "frase_24.mp3",
  "AU-06": "frase_25.mp3",
  "P-RELOJ": "frase_26.mp3",
  "R-CRONOLOGIA": "frase_27.mp3",
  "P-CUSTODIA": "frase_28.mp3",
  "R-ORIGINALES": "frase_29.mp3"
};

export function interviewAudioUrl(id: string): string {
  return `${import.meta.env.BASE_URL}audio/enlace-ti/${interviewAudio[id]}`;
}
