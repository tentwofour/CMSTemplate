<?php
use Symfony\Component\HttpKernel\Kernel;
use Symfony\Component\Config\Loader\LoaderInterface;

class AppKernel extends Kernel
{

    public function registerBundles()
    {
        $bundles = array(
                new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
                new Symfony\Bundle\SecurityBundle\SecurityBundle(),
                new Symfony\Bundle\TwigBundle\TwigBundle(),
                new Symfony\Bundle\MonologBundle\MonologBundle(),
                new Symfony\Bundle\SwiftmailerBundle\SwiftmailerBundle(),
                new Symfony\Bundle\AsseticBundle\AsseticBundle(),
                new Symfony\Cmf\Bundle\RoutingBundle\CmfRoutingBundle(),
                
                new Doctrine\Bundle\DoctrineBundle\DoctrineBundle(),
                new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle(),
                new Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle(),
                
                new Sensio\Bundle\FrameworkExtraBundle\SensioFrameworkExtraBundle(),
                
                new JMS\SecurityExtraBundle\JMSSecurityExtraBundle(),
                new JMS\AopBundle\JMSAopBundle(),
                
                new Liip\ImagineBundle\LiipImagineBundle(),
                new Liip\CacheControlBundle\LiipCacheControlBundle(),
                
                new Knp\Bundle\GaufretteBundle\KnpGaufretteBundle(),
                new Knp\Bundle\MenuBundle\KnpMenuBundle(),
                
                new FOS\UserBundle\FOSUserBundle(),
                
                new Stof\DoctrineExtensionsBundle\StofDoctrineExtensionsBundle(),
                
                new Kunstmaan\AdminBundle\KunstmaanAdminBundle(),
                new Kunstmaan\PagePartBundle\KunstmaanPagePartBundle(),
                new Kunstmaan\MediaPagePartBundle\KunstmaanMediaPagePartBundle(),
                new Kunstmaan\MediaBundle\KunstmaanMediaBundle(),
                new Kunstmaan\AdminListBundle\KunstmaanAdminListBundle(),
                new Kunstmaan\SearchBundle\KunstmaanSearchBundle(),
                new Kunstmaan\NodeSearchBundle\KunstmaanNodeSearchBundle(),
                new Kunstmaan\SitemapBundle\KunstmaanSitemapBundle(),
                new Kunstmaan\ArticleBundle\KunstmaanArticleBundle(),
                new Kunstmaan\TranslatorBundle\KunstmaanTranslatorBundle(),
                new Kunstmaan\UtilitiesBundle\KunstmaanUtilitiesBundle(),
                new Kunstmaan\NodeBundle\KunstmaanNodeBundle(),
                new Kunstmaan\SeoBundle\KunstmaanSeoBundle(),
                new Kunstmaan\RedirectBundle\KunstmaanRedirectBundle(),
                new Kunstmaan\UserManagementBundle\KunstmaanUserManagementBundle(),
                new Kunstmaan\DashboardBundle\KunstmaanDashboardBundle(),
                
                new WhiteOctober\PagerfantaBundle\WhiteOctoberPagerfantaBundle(),
            
                new Sp\BowerBundle\SpBowerBundle(),
                
                new Ten24\GenericCMS\WebsiteBundle\Ten24GenericCMSWebsiteBundle()
                
        );
        
        if (in_array($this->getEnvironment(), array('dev'))) {
            $bundles[] = new Kunstmaan\LiveReloadBundle\KunstmaanLiveReloadBundle();
            $bundles[] = new Kunstmaan\GeneratorBundle\KunstmaanGeneratorBundle();
        }
        
        
        if(in_array($this->getEnvironment(), array(
                'dev',
                'test')))
        {
            $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
            $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
            $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
        }
        
        return $bundles;
    }

    public function registerContainerConfiguration(LoaderInterface $loader)
    {
        $loader->load(__DIR__ . '/config/config_' . $this->getEnvironment() . '.yml');
    }
}
