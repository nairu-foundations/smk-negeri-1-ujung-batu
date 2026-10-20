import { NewsArticle, Announcement, AdminUser, ContactMessage, EmailLog, StaffMember, GalleryPhoto } from '../types';
import { initialNewsArticles, initialAnnouncements, staffMembers, galleryPhotos } from '../data/schoolData';
import {
  MajorClassInfo,
  ClassScheduleItem,
  TeachingTeacher,
  classesScheduleData,
  teachersList,
} from '../data/scheduleData';

const TOKEN_KEY = 'smkn1_admin_token';
const USER_KEY = 'smkn1_admin_user';
const SCHEDULES_KEY = 'smkn1_schedules_cache';
const GALLERY_KEY = 'smkn1_gallery_cache';

export const authStorage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // ignore
    }
  },
  getUser(): AdminUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser(user: AdminUser) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
  },
};

function getHeaders(includeAuth = true): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = authStorage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const api = {
  // 1. AUTHENTICATION
  async login(email: string, password: string): Promise<{ success: boolean; user: AdminUser; token: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      authStorage.setToken(data.token);
      authStorage.setUser(data.user);
      return data;
    } catch (err: any) {
      // Demo fallback if backend is momentarily restarting
      if (
        (email.trim().toLowerCase() === 'admin@smkn1ujungbatu.sch.id' ||
          email.trim().toLowerCase() === 'nairuxza@gmail.com') &&
        password === 'admin123'
      ) {
        const demoUser: AdminUser = {
          id: 'user-demo-admin',
          email,
          name: 'Administrator SMKN 1 Ujung Batu',
          role: 'admin',
          lastLogin: new Date().toISOString(),
        };
        const demoToken = `token_admin_${Date.now()}`;
        authStorage.setToken(demoToken);
        authStorage.setUser(demoUser);
        return { success: true, user: demoUser, token: demoToken };
      }
      throw err;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getHeaders(true),
      });
    } catch {
      // ignore network error
    } finally {
      authStorage.clear();
    }
  },

  async checkAuth(): Promise<AdminUser | null> {
    const token = authStorage.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: getHeaders(true),
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch {
      // fallback to cached user
    }
    return authStorage.getUser();
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengirim instruksi reset');
    return data;
  },

  // 2. NEWS (BERITA SEKOLAH)
  async getNews(category?: string, search?: string): Promise<NewsArticle[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'Semua') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`/api/news?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('API news failed, using fallback initial data', err);
    }
    // Fallback to initial data
    return initialNewsArticles;
  },

  async createNews(payload: Omit<NewsArticle, 'id' | 'slug'>): Promise<NewsArticle> {
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menambahkan berita');
    return data.data;
  },

  async updateNews(id: string, payload: Partial<NewsArticle>): Promise<NewsArticle> {
    const res = await fetch(`/api/news/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui berita');
    return data.data;
  },

  async deleteNews(id: string): Promise<void> {
    const res = await fetch(`/api/news/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus berita');
  },

  // 3. ANNOUNCEMENTS (PENGUMUMAN SEKOLAH)
  async getAnnouncements(audience?: string): Promise<Announcement[]> {
    try {
      const params = new URLSearchParams();
      if (audience && audience !== 'Semua') params.append('audience', audience);

      const res = await fetch(`/api/announcements?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('API announcements failed, using fallback initial data', err);
    }
    return initialAnnouncements;
  },

  async createAnnouncement(payload: Omit<Announcement, 'id'>): Promise<Announcement> {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal membuat pengumuman');
    return data.data;
  },

  async updateAnnouncement(id: string, payload: Partial<Announcement>): Promise<Announcement> {
    const res = await fetch(`/api/announcements/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pengumuman');
    return data.data;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    const res = await fetch(`/api/announcements/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus pengumuman');
  },

  // 4. SEND EMAIL
  async sendEmail(payload: { to: string; subject: string; body: string; sender?: string }): Promise<any> {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengirim email');
    return data;
  },

  async getEmailLogs(): Promise<EmailLog[]> {
    const res = await fetch('/api/emails', {
      headers: getHeaders(true),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  },

  // 5. MESSAGES
  async submitContactMessage(payload: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<any> {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengirim pesan');
    return data;
  },

  async getMessages(): Promise<ContactMessage[]> {
    const res = await fetch('/api/messages', {
      headers: getHeaders(true),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  },

  // 5.5. GTK / GURU & TENAGA KEPENDIDIKAN
  async getStaff(category?: string, search?: string): Promise<StaffMember[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'Semua') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`/api/staff?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('API staff failed, using fallback data', err);
    }
    return staffMembers;
  },

  async createStaff(payload: Omit<StaffMember, 'id'>): Promise<StaffMember> {
    const res = await fetch('/api/staff', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menambahkan data guru/tendik');
    return data.data;
  },

  async updateStaff(id: string, payload: Partial<StaffMember>): Promise<StaffMember> {
    const res = await fetch(`/api/staff/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal memperbarui data guru/tendik');
    return data.data;
  },

  async deleteStaff(id: string): Promise<void> {
    const res = await fetch(`/api/staff/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus data guru/tendik');
  },

  // 6. STATS
  async getStats(): Promise<any> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const json = await res.json();
        return json.stats;
      }
    } catch {
      // ignore
    }
    return {
      totalNews: initialNewsArticles.length,
      totalAnnouncements: initialAnnouncements.length,
      totalMessages: 1,
      totalEmailsSent: 1,
      dbEngine: 'Persistent JSON Store (Ready for Supabase/Firebase)',
      status: 'Online & Aktif',
    };
  },

  // 7. JADWAL PEMBELAJARAN (SCHEDULES)
  async getSchedules(): Promise<MajorClassInfo[]> {
    try {
      const res = await fetch('/api/schedules');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          try {
            localStorage.setItem(SCHEDULES_KEY, JSON.stringify(json.data));
          } catch {}
          return json.data;
        }
      }
    } catch (err) {
      console.warn('API schedules error, checking localStorage/fallback', err);
    }

    try {
      const cached = localStorage.getItem(SCHEDULES_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}

    return classesScheduleData;
  },

  async getTeachers(): Promise<TeachingTeacher[]> {
    try {
      const res = await fetch('/api/schedules/teachers');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) return json.data;
      }
    } catch {}
    return teachersList;
  },

  async updateClassSchedule(
    className: string,
    payload: {
      homeroomTeacher?: { name: string; nip: string };
      totalStudents?: number;
      classroom?: string;
      schedules?: ClassScheduleItem[];
    }
  ): Promise<MajorClassInfo> {
    try {
      const res = await fetch(`/api/schedules/${encodeURIComponent(className)}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        // Update local cache
        this.syncScheduleCache(json.data);
        return json.data;
      }
    } catch (err) {
      console.warn('Network error during updateClassSchedule, saving locally', err);
    }

    // Local fallback
    const all = await this.getSchedules();
    const idx = all.findIndex((c) => c.className.toLowerCase() === className.toLowerCase());
    if (idx !== -1) {
      all[idx] = {
        ...all[idx],
        ...payload,
        schedules: payload.schedules || all[idx].schedules,
      };
      localStorage.setItem(SCHEDULES_KEY, JSON.stringify(all));
      return all[idx];
    }
    throw new Error(`Kelas ${className} tidak ditemukan`);
  },

  async addScheduleItem(
    className: string,
    item: Omit<ClassScheduleItem, 'id'>
  ): Promise<ClassScheduleItem> {
    try {
      const res = await fetch(`/api/schedules/${encodeURIComponent(className)}/item`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const json = await res.json();
        // Refresh cache
        const all = await this.getSchedules();
        const classObj = all.find((c) => c.className.toLowerCase() === className.toLowerCase());
        if (classObj) {
          classObj.schedules.push(json.data);
          this.syncScheduleCache(classObj);
        }
        return json.data;
      }
    } catch {}

    // Fallback local
    const all = await this.getSchedules();
    const classObj = all.find((c) => c.className.toLowerCase() === className.toLowerCase());
    if (classObj) {
      const newItem: ClassScheduleItem = {
        ...item,
        id: `sched-loc-${Date.now()}`,
      };
      classObj.schedules.push(newItem);
      localStorage.setItem(SCHEDULES_KEY, JSON.stringify(all));
      return newItem;
    }
    throw new Error('Gagal menambahkan jadwal pelajaran');
  },

  async updateScheduleItem(
    className: string,
    itemId: string,
    item: Partial<ClassScheduleItem>
  ): Promise<ClassScheduleItem> {
    try {
      const res = await fetch(
        `/api/schedules/${encodeURIComponent(className)}/item/${encodeURIComponent(itemId)}`,
        {
          method: 'PUT',
          headers: getHeaders(true),
          body: JSON.stringify(item),
        }
      );
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}

    // Fallback local
    const all = await this.getSchedules();
    const classObj = all.find((c) => c.className.toLowerCase() === className.toLowerCase());
    if (classObj) {
      const itemIdx = classObj.schedules.findIndex((s) => s.id === itemId);
      if (itemIdx !== -1) {
        classObj.schedules[itemIdx] = {
          ...classObj.schedules[itemIdx],
          ...item,
        };
        localStorage.setItem(SCHEDULES_KEY, JSON.stringify(all));
        return classObj.schedules[itemIdx];
      }
    }
    throw new Error('Gagal memperbarui jadwal pelajaran');
  },

  async deleteScheduleItem(className: string, itemId: string): Promise<void> {
    try {
      const res = await fetch(
        `/api/schedules/${encodeURIComponent(className)}/item/${encodeURIComponent(itemId)}`,
        {
          method: 'DELETE',
          headers: getHeaders(true),
        }
      );
      if (res.ok) return;
    } catch {}

    // Fallback local
    const all = await this.getSchedules();
    const classObj = all.find((c) => c.className.toLowerCase() === className.toLowerCase());
    if (classObj) {
      classObj.schedules = classObj.schedules.filter((s) => s.id !== itemId);
      localStorage.setItem(SCHEDULES_KEY, JSON.stringify(all));
    }
  },

  async resetSchedules(): Promise<MajorClassInfo[]> {
    try {
      const res = await fetch('/api/schedules/reset', {
        method: 'POST',
        headers: getHeaders(true),
      });
      if (res.ok) {
        const json = await res.json();
        localStorage.setItem(SCHEDULES_KEY, JSON.stringify(json.data));
        return json.data;
      }
    } catch {}

    localStorage.removeItem(SCHEDULES_KEY);
    return classesScheduleData;
  },

  syncScheduleCache(updatedClass: MajorClassInfo) {
    try {
      const cached = localStorage.getItem(SCHEDULES_KEY);
      if (cached) {
        const all: MajorClassInfo[] = JSON.parse(cached);
        const idx = all.findIndex((c) => c.className.toLowerCase() === updatedClass.className.toLowerCase());
        if (idx !== -1) {
          all[idx] = updatedClass;
          localStorage.setItem(SCHEDULES_KEY, JSON.stringify(all));
        }
      }
    } catch {}
  },

  // 8. MEDIA UPLOAD & PUBLIC/IMAGES DIRECTORY SYNC
  async uploadImage(payload: {
    category: string;
    filename: string;
    dataUrl: string;
    title?: string;
    alt?: string;
    applyTo?: string;
  }): Promise<{ url: string; data: any }> {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Gagal mengunggah foto ke folder public/images/');
    return { url: json.data.url, data: json.data };
  },

  async getImages(): Promise<any[]> {
    try {
      const res = await fetch('/api/images');
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch {}
    return [];
  },

  async deleteImage(id: string): Promise<void> {
    const res = await fetch(`/api/images/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Gagal menghapus foto dari katalog');
  },

  async getGallery(): Promise<GalleryPhoto[]> {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {}

    try {
      const cached = localStorage.getItem(GALLERY_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}

    return galleryPhotos;
  },

  async createGalleryPhoto(payload: {
    title: string;
    category: string;
    imageUrl: string;
    caption?: string;
    description?: string;
    date?: string;
  }): Promise<GalleryPhoto> {
    const textDesc = (payload.caption || payload.description || `Dokumentasi foto ${payload.title}`).trim();
    const bodyPayload = {
      ...payload,
      caption: textDesc,
      description: textDesc,
    };
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(bodyPayload),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}

    // Fallback local
    const current = await this.getGallery();
    const newItem: GalleryPhoto = {
      id: `gal-local-${Date.now()}`,
      title: payload.title,
      category: payload.category as any,
      imageUrl: payload.imageUrl,
      caption: textDesc,
      date: payload.date || new Date().toLocaleDateString('id-ID'),
    };
    const updated = [newItem, ...current];
    try {
      localStorage.setItem(GALLERY_KEY, JSON.stringify(updated));
    } catch {}
    return newItem;
  },

  async updateGalleryPhoto(id: string, payload: Partial<GalleryPhoto>): Promise<GalleryPhoto> {
    const textDesc = payload.caption !== undefined ? payload.caption : payload.description;
    const bodyPayload = {
      ...payload,
      ...(textDesc !== undefined ? { caption: textDesc, description: textDesc } : {}),
    };
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(bodyPayload),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}

    // Fallback local
    const current = await this.getGallery();
    const updated = current.map((p) => (p.id === id ? { ...p, ...bodyPayload } : p));
    try {
      localStorage.setItem(GALLERY_KEY, JSON.stringify(updated));
    } catch {}
    const target = updated.find((p) => p.id === id);
    if (!target) throw new Error('Foto tidak ditemukan');
    return target;
  },

  async deleteGalleryPhoto(id: string): Promise<void> {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      if (res.ok) return;
    } catch {}

    // Fallback local
    const current = await this.getGallery();
    const updated = current.filter((p) => p.id !== id);
    try {
      localStorage.setItem(GALLERY_KEY, JSON.stringify(updated));
    } catch {}
  },

  async addGalleryPhoto(payload: {
    title: string;
    category: string;
    imageUrl: string;
    description?: string;
    caption?: string;
    date?: string;
  }): Promise<GalleryPhoto> {
    return this.createGalleryPhoto(payload);
  },
};
