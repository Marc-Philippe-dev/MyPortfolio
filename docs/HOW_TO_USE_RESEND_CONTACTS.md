# Guide : Utiliser Resend Contacts pour les Campagnes

## 🎯 Configuration Actuelle

Votre système est déjà configuré pour ajouter automatiquement les abonnés confirmés à Resend Contacts. Voici comment l'utiliser pour vos campagnes.

## 📋 Étape 1 : Créer une Audience dans Resend

1. Allez sur [Resend Dashboard](https://resend.com/audiences)
2. Cliquez sur "Create Audience"
3. Donnez un nom (ex: "Newsletter Subscribers")
4. Copiez l'**Audience ID**

## 📋 Étape 2 : Configurer l'Audience ID

Ajoutez dans votre `.env.local` :

```env
RESEND_AUDIENCE_ID=your_audience_id_here
```

## 📋 Étape 3 : Vérifier que ça fonctionne

1. Testez l'abonnement sur votre site
2. Confirmez l'email
3. Vérifiez dans [Resend Contacts](https://resend.com/contacts) que le contact apparaît

## 🚀 Envoyer une Campagne depuis Resend

### Méthode 1 : Interface Graphique (Recommandé)

1. Allez sur [Resend Dashboard](https://resend.com)
2. Cliquez sur "Emails" > "Create Email"
3. Sélectionnez votre audience
4. Créez votre email (HTML ou template)
5. Envoyez !

### Méthode 2 : API (Programmatique)

Vous pouvez créer une route API pour envoyer des campagnes :

```typescript
// app/api/newsletter/campaign/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const { subject, html, audienceId } = await request.json()
  
  // Récupérer tous les contacts de l'audience
  const contacts = await resend.contacts.list({ audienceId })
  
  // Envoyer à chaque contact
  for (const contact of contacts.data) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: contact.email,
      subject,
      html,
    })
  }
  
  return NextResponse.json({ success: true })
}
```

## 📊 Statistiques et Analytics

Dans Resend Dashboard, vous pouvez voir :
- Taux d'ouverture
- Taux de clics
- Bounces
- Désinscriptions
- Historique des emails envoyés

## 🎨 Bonnes Pratiques

1. **Segmenter votre audience** : Créez plusieurs audiences (ex: "Data Engineers", "Data Analysts")
2. **Utiliser des tags** : Organisez vos contacts avec des tags
3. **Respecter la fréquence** : Ne pas spammer vos abonnés
4. **Personnaliser** : Utilisez les variables pour personnaliser les emails
5. **Tester** : Envoyez toujours un test avant une campagne

## 🔄 Synchronisation avec le JSON

Le fichier `data/subscribers.json` continue de servir pour :
- ✅ Gérer les tokens de confirmation
- ✅ Suivre les statuts (pending/confirmed/unsubscribed)
- ✅ Backup local

Resend Contacts sert pour :
- ✅ Campagnes de mailing
- ✅ Gestion des audiences
- ✅ Statistiques et analytics
- ✅ Source de vérité pour les emails confirmés

## ⚠️ Gestion des Désinscriptions

Quand un utilisateur se désabonne :
1. Le statut dans `subscribers.json` passe à `unsubscribed`
2. **Important** : Vous devez aussi le retirer de Resend Contacts manuellement ou via API

```typescript
// Retirer un contact de l'audience
await resend.contacts.remove({
  audienceId: process.env.RESEND_AUDIENCE_ID!,
  id: contactId
})
```

## 🎯 Prochaines Améliorations Possibles

1. **Synchronisation automatique** : Retirer automatiquement de Resend lors de la désinscription
2. **Tags automatiques** : Ajouter des tags selon la source d'abonnement
3. **Métadonnées** : Stocker des infos supplémentaires (date d'abonnement, source, etc.)
4. **Segmentation avancée** : Créer des audiences dynamiques selon les critères

