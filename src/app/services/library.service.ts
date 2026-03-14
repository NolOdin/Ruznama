import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, BehaviorSubject } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

export interface LibraryItem {
    id: string;
    title: string;
    content: string; // HTML content
    originalContent?: any;
    type: 'azkar' | 'dua' | 'usul_din';
}

@Injectable({
    providedIn: 'root'
})
export class LibraryService {

    private libraryItems: LibraryItem[] = [];

    readonly loading$ = new BehaviorSubject<boolean>(false);
    readonly error$ = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) { }

    /** Call this to force a fresh reload (used by Retry). */
    reset(): void {
        this.libraryItems = [];
    }

    loadLibrary(): Observable<LibraryItem[]> {
        if (this.libraryItems.length > 0) {
            return of(this.libraryItems);
        }

        this.loading$.next(true);
        this.error$.next(false);

        const mavaqit$ = this.http.get<any>('assets/library/azkars/azkar_mavaqit.json').pipe(
            map(data => ({
                id: 'azkar_mavaqit',
                title: data.title || 'Азкяры',
                content: this.formatAzkar(data.content),
                originalContent: data.content,
                type: 'azkar'
            } as LibraryItem)),
            catchError(err => {
                console.error('Failed to load azkar_mavaqit', err);
                return of(null);
            })
        );

        const dua$ = this.http.get<any>('assets/library/dua/dua.json').pipe(
            map(data => ({
                id: 'dua_quran',
                title: data.title || 'Дуа',
                content: this.formatDua(data.content),
                originalContent: data.content,
                type: 'dua'
            } as LibraryItem)),
            catchError(err => {
                console.error('Failed to load dua', err);
                return of(null);
            })
        );

        const usulDin$ = this.http.get<any>('assets/library/usul_din/usul_din.json').pipe(
            map(data => ({
                id: 'usul_din',
                title: data.title || 'Усуль ад-Дин',
                content: this.formatUsulDin(data.content),
                originalContent: data.content,
                type: 'usul_din'
            } as LibraryItem)),
            catchError(err => {
                console.error('Failed to load usul_din', err);
                return of(null);
            })
        );

        return forkJoin([mavaqit$, dua$, usulDin$]).pipe(
            map(results => {
                const loaded = results.filter((item) => item !== null) as LibraryItem[];
                if (loaded.length === 0) {
                    // All requests failed — treat as network error
                    this.error$.next(true);
                } else {
                    this.libraryItems = loaded;
                    this.error$.next(false);
                }
                return this.libraryItems;
            }),
            finalize(() => this.loading$.next(false))
        );
    }

    private formatAzkar(items: any[]): string {
        if (!Array.isArray(items)) return '';
        return items.map(item => {
            let html = `<div style="margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;"><ul>`;
            if (item.step) html += `<div style="opacity: 0.7; font-size: 0.9em; margin-bottom: 5px;"><li>${item.step}</div>`;
            if (item.name) html += `<h4 style="margin: 5px 0 10px 0;">${item.name}</h4>`;
            if (item.arabic) html += `<div style="font-size: 1.2em; text-align: right; margin-bottom: 10px; font-family: sans-serif;">${item.arabic}</div>`;
            if (item.transliteration) html += `<div style="margin-bottom: 8px; font-style: italic;">${item.transliteration}</div>`;
            if (item.translation) html += `<div>${item.translation}</div>`;
            if (item.phrase) html += `<div style="font-weight: bold;">${item.phrase} <span style="font-weight: normal;">(x${item.count})</span></div>`;
            if (item.reference) html += `<div style="font-size: 0.8em; opacity: 0.6; margin-top: 5px;">${item.reference}</div>`;
            html += `</ul></div>`;
            return html;
        }).join('');
    }

    private formatDua(items: any[]): string {
        if (!Array.isArray(items)) return '';
        return items.map(item => {
            let html = `<div style="margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;"><ul style="padding-left: 20px;">`;
            if (item.arabic) html += `<div style="font-size: 1.2em; text-align: right; margin-bottom: 10px;" id="arr_font_naskh"><li>${item.arabic}</div>`;
            if (item.translation) html += `<div>${item.translation}</div>`;
            if (item.source) html += `<div style="opacity: 0.7; font-size: 0.9em; margin-bottom: 5px;">${item.source}</div>`;
            html += `</ul></div>`;
            return html;
        }).join('');
    }

    private formatUsulDin(items: any[]): string {
        if (!Array.isArray(items)) return '';
        return items.map(item => {
            let html = `<div style="margin-bottom: 25px;">`;
            if (item.level_name) html += `<h3 style="margin-bottom: 10px; color: #ffd700;">${item.level_name}</h3>`;
            if (item.formula) html += `<p style="margin-bottom: 15px;">${item.formula}</p>`;

            if (item.pillars && Array.isArray(item.pillars)) {
                html += `<ul style="padding-left: 20px;">`;
                item.pillars.forEach((p: any) => {
                    html += `<li style="margin-bottom: 10px;">`;
                    if (p.name || p.title) html += `<strong>${p.name || p.title}</strong>`;
                    if (p.arabic) html += ` <span style="font-family: sans-serif;">(${p.arabic})</span>`;
                    if (p.details || p.aspects) html += `: ${p.details || p.aspects}`;
                    if (p.list) html += `: ${p.list.join(', ')}`;
                    html += `</li>`;
                });
                html += `</ul>`;
            }

            if (item.key_aspects && Array.isArray(item.key_aspects)) {
                html += `<ul style="padding-left: 20px;">`;
                item.key_aspects.forEach((a: any) => {
                    html += `<li style="margin-bottom: 10px;"><strong>${a.aspect}</strong>: ${a.meaning}</li>`;
                });
                html += `</ul>`;
            }

            html += `</div>`;
            return html;
        }).join('');
    }
}
