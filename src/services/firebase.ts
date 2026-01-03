import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '@/config/firebase';

export class FirebaseAPI {
  // Content Management
  static async saveContent(data: {
    type: string;
    title: string;
    content: string;
    excerpt?: string;
    status?: string;
  }) {
    const docRef = await addDoc(collection(db, 'content'), {
      ...data,
      status: data.status || 'published',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  }

  static async getContent(type?: string) {
    let q = query(
      collection(db, 'content'),
      where('status', '==', 'published'),
      orderBy('updatedAt', 'desc')
    );
    
    if (type) {
      q = query(
        collection(db, 'content'),
        where('type', '==', type),
        where('status', '==', 'published'),
        orderBy('updatedAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  static async updateContent(id: string, data: any) {
    const docRef = doc(db, 'content', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  }

  // Photo Management
  static async uploadPhoto(file: File, options: {
    category?: string;
    altText?: string;
    caption?: string;
  } = {}) {
    const category = options.category || 'general';
    const fileName = `${category}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `images/${fileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Save metadata to Firestore
    const docRef = await addDoc(collection(db, 'photos'), {
      filename: fileName,
      originalName: file.name,
      category,
      altText: options.altText || '',
      caption: options.caption || '',
      url: downloadURL,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: serverTimestamp()
    });
    
    return {
      success: true,
      id: docRef.id,
      url: downloadURL
    };
  }

  static async getPhotos(category?: string) {
    let q = query(
      collection(db, 'photos'),
      orderBy('uploadedAt', 'desc')
    );
    
    if (category) {
      q = query(
        collection(db, 'photos'),
        where('category', '==', category),
        orderBy('uploadedAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Events Management
  static async createEvent(data: {
    title: string;
    description: string;
    eventDate: string;
    location?: string;
    category?: string;
    featuredImage?: string;
  }) {
    const docRef = await addDoc(collection(db, 'events'), {
      ...data,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  }

  static async getEvents() {
    const q = query(
      collection(db, 'events'),
      orderBy('eventDate', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}