import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastController } from '@ionic/angular';
import { Evento } from 'src/modelo/Evento';
import { Noticia } from 'src/modelo/Noticia';
import { Partitura } from 'src/modelo/Partitura';
import { Usuario } from 'src/modelo/Usuario';

@Injectable()
export class FireServiceProvider {

    constructor(private angularFirestore: AngularFirestore,
        private afStorage: AngularFireStorage, private toastController: ToastController) {
    }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }//end Toast



     //=============
    //| Ficheros  |
    //=============

    uploadPdfDocument(file: File, name: string): Promise<string> {
        var promise: Promise<string> = new Promise<string>((resolve, reject) => {
            //Se comprueba que el tipo del fichero pertenece a un tipo pdf
            if (file.type !== 'application/pdf') {
                reject("El fichero no es de tipo pdf");
            }
            //se calcula el path dentro del storage de firebase
            //se guarda dentro de una carpeta avatar
            //el nombre del fichero es igual al id del usuario precedido de la hora dada por getTime 
            const fileStoragePath = `repertorio/${name}`;

            // Image reference
            const pdfRef = this.afStorage.ref(fileStoragePath);

            // File upload task
            this.afStorage.upload(fileStoragePath, file)
                .then((data) => {
                    pdfRef.getDownloadURL().subscribe(resp => {
                        resolve(resp);
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
        return (promise);
    }//end uploadPdfDocument

    uploadImage(file: File, name: string): Promise<string> {
        var promise: Promise<string> = new Promise<string>((resolve, reject) => {
            //Se comprueba que el tipo del fichero pertenece a un tipo imagen
            if (file.type.split('/')[0] !== 'image') {
                reject("El fichero no es de tipo imagen");
            }
            //se calcula el path dentro del storage de firebase
            const fileStoragePath = `imagenesNoticias/${name}`;

            // Image reference
            const imageRef = this.afStorage.ref(fileStoragePath);

            // File upload task
            this.afStorage.upload(fileStoragePath, file)
                .then((data) => {
                    imageRef.getDownloadURL().subscribe(resp => {
                        resolve(resp);
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
        return (promise);
    }//end_uploadImage


    removeFile(fileUrl: string): Promise<string> {

        var promise: Promise<string> = new Promise<string>((resolve, reject) => {

            var imageRef = this.afStorage.refFromURL(fileUrl);

            imageRef.delete().subscribe(resp => {

                resolve(resp);

            },

                error => {

                    reject(error);

                });

        });

        return (promise);

    }//end_uploadImage

//======================================================================================

    //====================
    //| Objetos firebase |
    //====================

//======================================================================================

    //==============
    //| Getters By |
    //==============

    getUsuarioByEmail(email): Promise<Usuario> {
        let promise = new Promise<Usuario>((resolve, reject) => {
            const usuariosRef = this.angularFirestore.collection('Usuarios').ref;
            usuariosRef.where('email', '==', email).get()
                .then((data: any) => {

                    let usuario = new Usuario
                    data.forEach(element => {
                        let usuarioJson = element.data();
                        usuario = Usuario.createFromJsonObject(usuarioJson);

                    });
                    resolve(usuario);
                })
                .catch((error: Error) => {
                    this.presentToast('Error, no existe ningún usuario con ese email')
                    reject(error.message);
                });
        });
        return promise;
    }//end get usuarios



//======================================================================================

    //==============
    //| Getters TR |
    //==============

    getUsuariosTR(): any {
        return (this.angularFirestore.collection('Usuarios').snapshotChanges());
    }

    getNoticiasTR(): any {
        return (this.angularFirestore.collection('Noticias').snapshotChanges());
    }

    getPartiturasTR(): any {
        return (this.angularFirestore.collection('Repertorio').snapshotChanges());
    }


//======================================================================================

    //===========
    //| Deletes |
    //===========

    eliminarUsuario(usuario: Usuario, valor:boolean): Promise<Boolean> {
        let promise = new Promise<Boolean>((resolve, reject) => {
            this.angularFirestore.collection('Usuarios').doc(usuario.id).delete().then(
                (data: any) => { 
                    if(valor){
                    this.presentToast(usuario.nombre+ ' '+ usuario.apellidos +' ha sido eliminado')
                

                    //Email para eliminar de la autenticación de Firebase
                    let usu={
                        emailBorrar: usuario.email,
                        fechaBorrado: new Date()
                    }
                   this.angularFirestore.collection('UsuariosBorrados').add(usu)

                }
                    resolve(true);
                }
            )
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }//end_eliminar_usuario


    eliminarNoticia(noticia: Noticia): Promise<Boolean> {
        let promise = new Promise<Boolean>((resolve, reject) => {
            this.angularFirestore.collection('Noticias').doc(noticia.id).delete().then(
                (data: any) => { 
                    this.removeFile(noticia.imagen);
                    this.presentToast('La noticia: '+noticia.titulo+' ha sido eliminada')
                    resolve(true);
                }
            )
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }//end_eliminar_noticia

    eliminarPartitura(partitura: Partitura): Promise<Boolean> {
        let promise = new Promise<Boolean>((resolve, reject) => {
            this.angularFirestore.collection('Repertorio').doc(partitura.id).delete().then(
                (data: any) => { 
                    this.removeFile(partitura.fichero);
                    this.presentToast(partitura.titulo+ ' - '+ partitura.autor+' ha sido eliminada')
                    resolve(true);
                }
            )
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }//end_eliminar_partitura


    eliminarEvento(evento): Promise<Boolean> {
        let promise = new Promise<Boolean>((resolve, reject) => {
            this.angularFirestore.collection('Eventos').doc(evento.id).delete().then(
                (data: any) => { 
                    this.presentToast('El evento: '+evento.title+' ha sido eliminado')
                    resolve(true);
                }
            )
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }//end_eliminar_evento


//======================================================================================

    //===========
    //| Updates |
    //===========

    modificarUsuario(nuevosDatosUsuario: Usuario): Promise<Usuario> {
        let promise = new Promise<Usuario>((resolve, reject) => {
            this.angularFirestore.collection("Usuarios").doc(nuevosDatosUsuario.id).update(JSON.parse(JSON.stringify(nuevosDatosUsuario)))
                .then(() => {
                    this.presentToast(nuevosDatosUsuario.nombre+ ' '+ nuevosDatosUsuario.apellidos +' ha sido modificad@')
                    resolve(nuevosDatosUsuario);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }//end_modificar_usuario

    modificarNoticia(nuevosDatosNoticia: Noticia): Promise<Noticia> {
        let promise = new Promise<Noticia>((resolve, reject) => {
            this.angularFirestore.collection("Noticias").doc(nuevosDatosNoticia.id).update(JSON.parse(JSON.stringify(nuevosDatosNoticia)))
                .then(() => {
                    this.presentToast('La noticia: '+nuevosDatosNoticia.titulo +' ha sido modificada')
                    resolve(nuevosDatosNoticia);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }//end_modificar_noticia

    modificarPartitura(nuevosDatosPartitura: Partitura): Promise<Partitura> {
        let promise = new Promise<Partitura>((resolve, reject) => {
            this.angularFirestore.collection("Repertorio").doc(nuevosDatosPartitura.id).update(JSON.parse(JSON.stringify(nuevosDatosPartitura)))
                .then(() => {
                    this.presentToast('La partitura: '+nuevosDatosPartitura.titulo+ ' - '+ nuevosDatosPartitura.autor+' ha sido modificada')
                    resolve(nuevosDatosPartitura);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }//end_modificar_partitura

   

//======================================================================================

    //===========
    //| Inserts |
    //===========

    insertarUsuario(datosNuevoUsuario: Usuario, opcion:boolean): Promise<Usuario> {
        let promise = new Promise<Usuario>((resolve, reject) => {
            datosNuevoUsuario.id = this.angularFirestore.collection("Usuarios").ref.doc().id;
            this.angularFirestore.collection("Usuarios").doc(datosNuevoUsuario.id).set(JSON.parse(JSON.stringify(datosNuevoUsuario)))
                .then(() => {
                    if(opcion)
                        this.presentToast(datosNuevoUsuario.nombre+ ' '+ datosNuevoUsuario.apellidos +' ha sido modificad@')
                    resolve(datosNuevoUsuario);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }//end_insertarUsuario


    insertarNoticia(datosNuevoNoticia: Noticia): Promise<Noticia> {
        let promise = new Promise<Noticia>((resolve, reject) => {
            datosNuevoNoticia.id = this.angularFirestore.collection("Noticias").ref.doc().id;
            this.angularFirestore.collection("Noticias").doc(datosNuevoNoticia.id).set(JSON.parse(JSON.stringify(datosNuevoNoticia)))
                .then(() => {
                    this.presentToast('La noticia: '+datosNuevoNoticia.titulo +' ha sido añadida')
                    resolve(datosNuevoNoticia);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }//end_insertarNoticia

    insertarPartitura(datosNuevoPartitura: Partitura): Promise<Partitura> {
        let promise = new Promise<Partitura>((resolve, reject) => {
            datosNuevoPartitura.id = this.angularFirestore.collection("Repertorio").ref.doc().id;
            this.angularFirestore.collection("Repertorio").doc(datosNuevoPartitura.id).set(JSON.parse(JSON.stringify(datosNuevoPartitura)))
                .then(() => {
                    this.presentToast('La partitura: '+datosNuevoPartitura.titulo+ ' - '+ datosNuevoPartitura.autor+' ha sido añadida')
                    resolve(datosNuevoPartitura);
                })
                .catch((error: Error) => {
                    reject(error.message);
                });
        });
        return promise;
    }//end_insertarPartitura
    


}//end_class