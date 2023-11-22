import languageExtensions from './langExtensions.json'

export default function getLanguage(extension) {
    if(extension.charAt(0)==='.'){
        return languageExtensions[extension];
    }
}