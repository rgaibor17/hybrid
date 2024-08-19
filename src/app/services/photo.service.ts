import { Injectable } from '@angular/core';

/* 1. Importe los módulos con la funcionalidad nativa */
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

/* 1. Importa el módulo Platform y Capacitor */
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

/* 1. Importe las preferencias del dispositivo */
import { Preferences } from '@capacitor/preferences';


/* 2. Importe la interfaz */
import { UserPhoto } from '../interfaces/user-photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  /* 3. Atributo para almacenar las fotos */
  public photos: UserPhoto[] = [];

  /* 2. Referencia local a la plataforma utilizada 'hybrid' o 'web' */
  private platform: Platform;

  /* 2. Clave para el almacenamiento */
  private PHOTO_STORAGE: string = 'photos';

  /* 3. Referencia en la inyección de dependencias */
  constructor(platform: Platform) {
    this.platform = platform;
  }

  public async addNewToGallery() {

    /* 4. Tome una foto */
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    /* 5. Agregue el archivo al inicio del arreglo */
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    /* 3. Ruta de almacenamiento */
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    /* 5. Agregue el archivo al inicio del arreglo */
    /* 
    this.photos.unshift({
      filepath: "soon...",
      webviewPath: capturedPhoto.webPath!
    }); 
    */
  }

  /* 1. La función savePicture guarda una foto en el sistema de archivos y gestiona cómo se debe mostrar la imagen dependiendo de si la aplicación está en un entorno híbrido (Cordova o Capacitor) o en la web.*/

  private async savePicture(photo: Photo) {

    const base64Data = await this.readAsBase64(photo);

    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {

      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {

      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };

    }
  }

  /* 2. La función readAsBase64 convierte una foto a formato base64, ajustando el proceso según la plataforma. */

  private async readAsBase64(photo: Photo) {

    if (this.platform.is('hybrid')) {

      const file = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data;

    } else {

      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }

  }

  /* 3. La función convertBlobToBase64 convierte un blob a formato base64. */

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  /* 1. La función loadSaved recupera y carga fotos guardadas previamente, 
   adaptando el proceso según la plataforma en la que se ejecuta la aplicación (híbrida o web). */

  public async loadSaved() {

    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];


    if (!this.platform.is('hybrid')) {

      for (let photo of this.photos) {

        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });

        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

}