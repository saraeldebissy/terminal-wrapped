/**
 * Secrets detection section - displays potentially exposed secrets with appropriate shame
 */

import { motion } from 'motion/react';
import type { SecretsStats } from '../../api/types';
import { StaggeredList, StaggeredItem } from '../motion/StaggeredList';

export interface SecretsSectionProps {
  secrets: SecretsStats;
}

const SHAME_MESSAGES = [
  "Your shell history is basically a password manager with zero security.",
  "Congratulations, you've created a free API key buffet for anyone with access to your machine.",
  "These secrets are about as secret as a billboard on the highway.",
  "Your ~/.zsh_history file is doing more leaking than a rusty faucet.",
  "Somewhere, a security auditor just felt a disturbance in the force.",
  "Pro tip: 'history' is not short for 'secure credential storage'.",
  "Your future self is going to be very disappointed about this.",
  "This is why we can't have nice things. Or secure systems.",
];

const ROAST_BY_TYPE: Record<string, string> = {
  'GitHub Token': "GitHub tokens! Now anyone can push to your repos. What could go wrong?",
  'AWS Access Key': "AWS keys in plain text. Hope you like surprise cloud bills!",
  'AWS Secret Key': "AWS secrets exposed. Time to check if someone's mining crypto on your account.",
  'Database URL': "Database credentials! Your data wants to be free, apparently.",
  'API Key': "API keys just chilling in your history. Very chill. Very insecure.",
  'JWT Token': "JWTs in your history. It's like leaving your house key under the doormat, but worse.",
  'Slack Token': "Slack tokens exposed. Now hackers can post memes in your #general too.",
  'Environment Variable': "Sensitive env vars in history. .env files are crying.",
  'curl Credentials': "curl with hardcoded creds. Classic mistake. Timeless, really.",
  'Auth Header': "Auth headers in the clear. At least you're consistent about it.",
  'Private Key': "A private key?! In your SHELL HISTORY?! We need to talk.",
};

export function SecretsSection({ secrets }: SecretsSectionProps) {
  const { totalSecretsFound, secretTypes, potentialSecrets } = secrets;

  if (totalSecretsFound === 0) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
        >
          <span className="text-6xl mb-4 block">🏆</span>
        </motion.div>
        <h3 className="text-xl font-bold text-accent mb-2">Clean Record!</h3>
        <p className="text-slate-400">
          No exposed secrets detected. You're either very careful or very sneaky.
          Either way, your InfoSec team would be proud.
        </p>
      </div>
    );
  }

  // Pick a random shame message
  const shameMessage = SHAME_MESSAGES[Math.floor(Math.random() * SHAME_MESSAGES.length)];

  // Get type-specific roast
  const primaryType = secretTypes[0]?.type;
  const typeRoast = primaryType ? ROAST_BY_TYPE[primaryType] : null;

  return (
    <div className="space-y-6">
      {/* Shame banner */}
      <motion.div
        className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <motion.span
          className="text-5xl block mb-4"
          animate={{
            rotate: [0, -10, 10, -10, 0],
          }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            repeat: 2,
          }}
        >
          🚨
        </motion.span>
        <h3 className="text-2xl font-bold text-red-400 mb-2">
          {totalSecretsFound} Secret{totalSecretsFound !== 1 ? 's' : ''} Exposed
        </h3>
        <p className="text-red-200/80 italic">
          "{shameMessage}"
        </p>
      </motion.div>

      {/* Type-specific roast */}
      {typeRoast && (
        <motion.div
          className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-orange-300 text-sm">
            <span className="font-bold">Special mention:</span> {typeRoast}
          </p>
        </motion.div>
      )}

      {/* Secret types breakdown with judgment */}
      {secretTypes.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-3">
            Your Hall of Shame
          </h3>
          <div className="flex flex-wrap gap-2">
            {secretTypes.map(({ type, count }) => (
              <motion.span
                key={type}
                className="px-3 py-1.5 bg-red-900/30 border border-red-700/50 rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-red-400 font-medium">{type}</span>
                <span className="text-red-300/60 ml-2">x{count}</span>
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Sample redacted commands */}
      {potentialSecrets.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-3">
            Evidence of Your Crimes (Redacted)
          </h3>
          <StaggeredList className="space-y-2">
            {potentialSecrets.slice(0, 5).map((secret, index) => (
              <StaggeredItem key={index}>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 hover:border-red-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded font-medium">
                      {secret.type}
                    </span>
                    <span className="text-xs text-slate-600">exhibit #{index + 1}</span>
                  </div>
                  <code className="text-xs text-slate-400 font-mono break-all">
                    {secret.redactedCommand}
                  </code>
                </div>
              </StaggeredItem>
            ))}
          </StaggeredList>
          {potentialSecrets.length > 5 && (
            <p className="text-xs text-red-400/60 mt-3 text-center italic">
              ...and {potentialSecrets.length - 5} more crimes against security
            </p>
          )}
        </div>
      )}

      {/* Call to action with sass */}
      <motion.div
        className="text-center pt-4 border-t border-slate-700/50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-slate-500">
          Seriously though, you should probably rotate these. Like, now. We'll wait.
        </p>
      </motion.div>
    </div>
  );
}
