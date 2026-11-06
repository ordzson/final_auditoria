import type { StationId } from '../audit/types';

export type ComputerTheme = 'xp' | 'server-classic';
export type IconVariants = Readonly<{ 16: string; 32: string; 48?: string }>;
export type ComputerIcon = Readonly<{ source: string; sizes: IconVariants }>;

// Selección visual y procedencia: public/computers/CREDITS.md y manifest.json.
export const computerIcons = {
  xp: {
    sessions: { source: 'wxp_16.ico', sizes: { 16: '/computers/icons/xp/sessions-16.png', 32: '/computers/icons/xp/sessions-32.png', 48: '/computers/icons/xp/sessions-48.png' } },
    directory: { source: 'wxp_220.ico', sizes: { 16: '/computers/icons/xp/directory-16.png', 32: '/computers/icons/xp/directory-32.png', 48: '/computers/icons/xp/directory-48.png' } },
    query: { source: 'wxp_153.ico', sizes: { 16: '/computers/icons/xp/query-16.png', 32: '/computers/icons/xp/query-32.png' } },
    network: { source: 'wxp_19.ico', sizes: { 16: '/computers/icons/xp/network-16.png', 32: '/computers/icons/xp/network-32.png', 48: '/computers/icons/xp/network-48.png' } },
    orders: { source: 'wxp_1.ico', sizes: { 16: '/computers/icons/xp/orders-16.png', 32: '/computers/icons/xp/orders-32.png', 48: '/computers/icons/xp/orders-48.png' } },
    changes: { source: 'wxp_274.ico', sizes: { 16: '/computers/icons/xp/changes-16.png', 32: '/computers/icons/xp/changes-32.png', 48: '/computers/icons/xp/changes-48.png' } },
    events: { source: 'wxp_151.ico', sizes: { 16: '/computers/icons/xp/events-16.png', 32: '/computers/icons/xp/events-32.png', 48: '/computers/icons/xp/events-48.png' } },
    time: { source: 'wxp_339.ico', sizes: { 16: '/computers/icons/xp/time-16.png', 32: '/computers/icons/xp/time-32.png', 48: '/computers/icons/xp/time-48.png' } },
    recovery: { source: 'wxp_3.ico', sizes: { 16: '/computers/icons/xp/recovery-16.png', 32: '/computers/icons/xp/recovery-32.png' } },
    backup: { source: 'wxp_7.ico', sizes: { 16: '/computers/icons/xp/backup-16.png', 32: '/computers/icons/xp/backup-32.png', 48: '/computers/icons/xp/backup-48.png' } },
    explorer: { source: 'wxp_5.ico', sizes: { 16: '/computers/icons/xp/explorer-16.png', 32: '/computers/icons/xp/explorer-32.png', 48: '/computers/icons/xp/explorer-48.png' } },
    report: { source: 'wxp_152.ico', sizes: { 16: '/computers/icons/xp/report-16.png', 32: '/computers/icons/xp/report-32.png', 48: '/computers/icons/xp/report-48.png' } },
    folder: { source: 'wxp_4.ico', sizes: { 16: '/computers/icons/xp/folder-16.png', 32: '/computers/icons/xp/folder-32.png', 48: '/computers/icons/xp/folder-48.png' } },
    document: { source: 'wxp_133.ico', sizes: { 16: '/computers/icons/xp/document-16.png', 32: '/computers/icons/xp/document-32.png' } },
    search: { source: 'wxp_23.ico', sizes: { 16: '/computers/icons/xp/search-16.png', 32: '/computers/icons/xp/search-32.png', 48: '/computers/icons/xp/search-48.png' } },
    help: { source: 'wxp_24.ico', sizes: { 16: '/computers/icons/xp/help-16.png', 32: '/computers/icons/xp/help-32.png', 48: '/computers/icons/xp/help-48.png' } },
  },
  classic: {
    recovery: { source: 'w2k_ms-dos_application.ico', sizes: { 16: '/computers/icons/classic/recovery-16.png', 32: '/computers/icons/classic/recovery-32.png' } },
    backup: { source: 'w2k_hard_drive.ico', sizes: { 16: '/computers/icons/classic/backup-16.png', 32: '/computers/icons/classic/backup-32.png', 48: '/computers/icons/classic/backup-48.png' } },
    explorer: { source: 'w2k_folder_open.ico', sizes: { 16: '/computers/icons/classic/explorer-16.png', 32: '/computers/icons/classic/explorer-32.png', 48: '/computers/icons/classic/explorer-48.png' } },
    report: { source: 'w2k_text_document.ico', sizes: { 16: '/computers/icons/classic/report-16.png', 32: '/computers/icons/classic/report-32.png', 48: '/computers/icons/classic/report-48.png' } },
    folder: { source: 'w2k_closed_folder.ico', sizes: { 16: '/computers/icons/classic/folder-16.png', 32: '/computers/icons/classic/folder-32.png', 48: '/computers/icons/classic/folder-48.png' } },
    document: { source: 'w2k_text_file.ico', sizes: { 16: '/computers/icons/classic/document-16.png', 32: '/computers/icons/classic/document-32.png', 48: '/computers/icons/classic/document-48.png' } },
    search: { source: 'w2k_find.ico', sizes: { 16: '/computers/icons/classic/search-16.png', 32: '/computers/icons/classic/search-32.png', 48: '/computers/icons/classic/search-48.png' } },
    help: { source: 'w2k_help.ico', sizes: { 16: '/computers/icons/classic/help-16.png', 32: '/computers/icons/classic/help-32.png', 48: '/computers/icons/classic/help-48.png' } },
  },
} as const satisfies Record<string, Record<string, ComputerIcon>>;

export type ComputerIconKey = keyof typeof computerIcons.xp;

export const computerAssets = {
  fonts: {
    family: 'TahomaXP',
    regular: '/computers/fonts/tahoma-regular.ttf',
    bold: '/computers/fonts/tahoma-bold.ttf',
  },
  branding: { windowsFlag: '/computers/branding/windows-flag.webp' },
  rackMonitor: {
    model: '/models/rack-monitor/scene.gltf',
    license: '/models/rack-monitor/license.txt',
    screenNode: 'Cube_RenderMonitor_0',
    screenMaterial: 'RenderMonitor',
  },
  stations: {
    accesos: { theme: 'xp', wallpaper: '/computers/wallpapers/xp-bliss.jpg' },
    sql_red: { theme: 'xp', wallpaper: '/computers/wallpapers/xp-professional-azul.jpg' },
    crm_cambios: { theme: 'xp', wallpaper: '/computers/wallpapers/xp-isla-tropical.jpg' },
    siem: { theme: 'xp', wallpaper: '/computers/wallpapers/stonehenge.jpg' },
    respaldos: { theme: 'server-classic', wallpaper: '/computers/wallpapers/camino-otonal.jpg' },
    mesa_auditor: { theme: 'xp', wallpaper: '/computers/wallpapers/duna-roja-luna.jpg' },
  },
} as const satisfies {
  fonts: { family: string; regular: string; bold: string };
  branding: { windowsFlag: string };
  rackMonitor: { model: string; license: string; screenNode: string; screenMaterial: string };
  stations: Record<StationId, { theme: ComputerTheme; wallpaper: string }>;
};
